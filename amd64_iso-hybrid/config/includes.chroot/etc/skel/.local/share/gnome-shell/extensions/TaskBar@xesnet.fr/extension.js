const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Gio = imports.gi.Gio;
const Shell = imports.gi.Shell;
const AppDisplay = imports.ui.appDisplay;
const Clutter = imports.gi.Clutter;
const Mainloop = imports.mainloop;
const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Extension.imports.lib;
const Windows = Extension.imports.windows;

const schema = "org.gnome.shell.extensions.TaskBar";

function init(extensionMeta)
{
    return new TaskBar(extensionMeta, schema);
}

function TaskBar(extensionMeta, schema)
{
    this.init(extensionMeta, schema);
}

TaskBar.prototype =
{
    settings: null,
    settingSignals: null,

    extensionMeta: null,
    saveApplicationMenu: null,
    boxMain: null,
    windows: null,

    tasksList: new Array(),

    desktopView: null,

    preview: null,
    previewTimer: null,

    init: function(extensionMeta, schema)
    {
	this.extensionMeta = extensionMeta;
	this.schema = schema;
    },

    onParamChanged: function()
    {
        this.disable();
        this.enable();
    },

    enable: function()
    {
        let settings = new Lib.Settings(this.schema);
        this.settings = settings.getSettings();

	//Save and remove default Application Menu
	if (this.settings.get_boolean("remove-default-application-menu"))
	{
	    this.saveApplicationMenu = Main.panel._appMenu.actor;
	    Main.panel._leftBox.remove_actor(this.saveApplicationMenu);
	}

	//Add TaskBar
	this.boxMain = new St.BoxLayout();
	Main.panel._leftBox.insert_child_at_index(this.boxMain, Main.panel._leftBox.get_children().length);

	//Desktop Button
	if (this.settings.get_boolean("display-desktop-button"))
	{
            let iconDesktop = new St.Icon(
		{
		    gicon: Gio.icon_new_for_string(this.extensionMeta.path + "/images/desktop.png"),
                    icon_type: St.IconType.SYMBOLIC,
		    icon_size: 24,
		    style_class: "tkb-desktop-icon"
		});
	    let buttonDesktop = new St.Button({ style_class: "panel-button" });
	    let signalDesktop = buttonDesktop.connect("clicked", Lang.bind(this, this.onClickDesktopButton));
	    buttonDesktop.set_child(iconDesktop);
	    
	    let boxDesktop = new St.BoxLayout({ style_class: "tkb-desktop-box" });
	    boxDesktop.add_actor(buttonDesktop);

	    this.boxMain.add_actor(boxDesktop);
	}

	//Init Windows Manage Callbacks
	this.windows = new Windows.Windows(this, this.onWindowsListChanged, this.onWindowChanged);

	//Reinit extension on param change
	this.settingSignals = [
	    this.settings.connect("changed::remove-default-application-menu", Lang.bind(this, this.onParamChanged)),
	    this.settings.connect("changed::display-desktop-button", Lang.bind(this, this.onParamChanged))
	];
    },

    disable: function()
    {
	//Remove Setting Signals
	this.settingSignals.forEach(
	    function(signal)
	    {
		this.settings.disconnect(signal);
	    },
	    this
	);
	this.settingSignals = null;

	//Remove current preview if necessary
	this.hidePreview();

	//Remove TaskBar
	this.windows.destruct();
	this.windows = null;

	Main.panel._leftBox.remove_actor(this.boxMain);
	this.boxMain = null;

	this.cleanTasksList();

	//Restore Application Menu
	if (this.saveApplicationMenu != null)
	{
	    Main.panel._leftBox.add(this.saveApplicationMenu);
	    this.saveApplicationMenu = null;
	}
    },

    onClickDesktopButton: function(button, pspec)
    {
	this.tasksList.forEach(
	    function(task)
	    {
		let [windowTask, buttonTask, signalsTask] = task;

		if (this.desktopView)
		    windowTask.unminimize(global.get_current_time());
		else
		{
		    windowTask.minimize(global.get_current_time());
		    buttonTask.remove_style_pseudo_class('active-task');
		}
	    },
	    this
	);

	this.desktopView = ! this.desktopView;
    },

    onClickTaskButton: function(button, pspec, window)
    {
	let numButton = pspec.get_button();

	if (numButton == 1) //Left Button
	{
	    this.tasksList.forEach(
		function(task)
		{
		    let [windowTask, buttonTask, signalsTask] = task;

		    if (windowTask == window)
		    {
			if (! windowTask.has_focus())
			{
			    windowTask.activate(global.get_current_time());
			    buttonTask.add_style_pseudo_class('active-task');
			}
			else
			{
			    windowTask.minimize(global.get_current_time());
			    buttonTask.remove_style_pseudo_class('active-task');
			}
		    }
		    else
			buttonTask.remove_style_pseudo_class('active-task');
		},
		this
	    );

	    this.desktopView = false;
	}
	else if (numButton == 2 && this.settings.get_boolean("close-button")) //Middle Button
	    window.delete(global.get_current_time());
    },
   
    onWindowsListChanged: function(windowsList, type, window)
    {
	this.desktopView = false;

	if (type == 0) //Add all windows (On init or workspace change)
	{
	    this.cleanTasksList();

	    windowsList.forEach(
		function(window)
		{
		    this.addTaskInList(window);
		},
		this
	    );

	    this.desktopView = false;

	    this.hidePreview();
	}
	else if (type == 1) //Add window
	{
	    this.addTaskInList(window);

	    this.desktopView = false;
	}
	else if (type == 2) //Remove window
	{
	    this.removeTaskInList(window);

	    this.hidePreview();
	}
    },

    onWindowChanged: function(window, type)
    {
	if (type == 0) //Focus
	{
	    this.tasksList.forEach(
		function(task)
		{
		    let [windowTask, buttonTask, signalsTask] = task;

		    if (windowTask == window)
			buttonTask.add_style_pseudo_class('active-task');
		    else
			buttonTask.remove_style_pseudo_class('active-task');
		},
		this
	    );
	}

	this.desktopView = false;
    },

    searchTaskInList: function(window)
    {
	let index = null;

	for (let indexTask in this.tasksList)
	{
	    let [windowTask, buttonTask, signalsTask] = this.tasksList[indexTask];

	    if (windowTask == window)
	    {
		index = indexTask;

		break;
	    }
	}

	return index;
    },

    addTaskInList: function(window)
    {
	let app = Shell.WindowTracker.get_default().get_window_app(window);
	let iconTask = new AppDisplay.AppIcon(app, { setSizeManually: true, showLabel: false });
	iconTask.setIconSize(22);

	let buttonTask = new St.Button({ style_class: "tkb-task-button" });
	buttonTask.set_child(iconTask.actor);

	let signalsTask = [
	    buttonTask.connect("button-press-event", Lang.bind(this, this.onClickTaskButton, window)),
	    buttonTask.connect("enter-event", Lang.bind(this, this.showPreview, window)),
	    buttonTask.connect("leave-event", Lang.bind(this, this.hidePreview))
	];

	if (window.has_focus())
	    buttonTask.add_style_pseudo_class('active-task');

	this.boxMain.add_actor(buttonTask);

	this.tasksList.push([ window, buttonTask, signalsTask ]);
    },

    removeTaskInList: function(window)
    {
	let index = this.searchTaskInList(window);

	if (index != null)
	{
	    let [windowTask, buttonTask, signalsTask] = this.tasksList[index];

	    signalsTask.forEach(
		function(signal)
		{
		    buttonTask.disconnect(signal);
		},
		this
	    );

	    buttonTask.destroy();
	    this.tasksList.splice(index, 1);

	    return true;
	}
	else
	    return false;
    },

    cleanTasksList: function()
    {
	for (let i = this.tasksList.length - 1; i>=0; i--)
	{
	    let [windowTask, buttonTask, signalsTask] = this.tasksList[i];

	    signalsTask.forEach(
		function(signal)
		{
		    buttonTask.disconnect(signal);
		},
		this
	    );

	    buttonTask.destroy();
	    this.tasksList.splice(i, 1);
	};
    },

    getThumbnail: function(window, size)
    {
	let thumbnail = null;
	let mutterWindow = window.get_compositor_private();

	if (mutterWindow)
	{
	    let windowTexture = mutterWindow.get_texture();
	    let [width, height] = windowTexture.get_size();    
	    let scale = Math.min(1.0, size / width, size / height);

	    thumbnail = new Clutter.Clone ({ source: windowTexture, reactive: true, width: width * scale, height: height * scale });
	}

	return thumbnail;
    },

    showPreview: function(button, pspec, window)
    {
	//Remove current preview if necessary
	this.hidePreview();

	if (this.settings.get_boolean("display-preview"))
	{
	    if (this.settings.get_int("preview-delay") == 0)
		this.showPreview2(button, window);
	    else
		this.previewTimer = Mainloop.timeout_add(this.settings.get_int("preview-delay"), Lang.bind(this, this.showPreview2, button, window));
	}
    },

    showPreview2: function(button, window)
    {
	//Remove current preview if necessary
	this.hidePreview();

	let app = Shell.WindowTracker.get_default().get_window_app(window);
	    
	this.preview = new St.BoxLayout({ style_class: "tkb-preview", vertical: true});

	let labelNamePreview = new St.Label({ text: app.get_name(), style_class: "tkb-preview-name" });
	this.preview.add_actor(labelNamePreview);

	let title = window.get_title();
	if (title.length > 50)
	    title = title.substr(0, 47) + "...";

	let labelTitlePreview = new St.Label({ text: title, style_class: "tkb-preview-title" });
	this.preview.add_actor(labelTitlePreview);
	
	let thumbnail = this.getThumbnail(window, this.settings.get_int("preview-size"));

	this.preview.add_actor(thumbnail);
				     
	global.stage.add_actor(this.preview);

	let [left, top] = button.get_transformed_position();

	this.preview.set_position(left - 10, 30);
    },

    hidePreview: function()
    {
	//Remove preview programmed if necessary
	if (this.previewTimer != null)
	{
	    Mainloop.source_remove(this.previewTimer);
	    this.previewTimer = null;
	}

	//Destroy Preview if displaying
	if (this.preview != null)
	{
	    this.preview.destroy();
	    this.preview = null;
	}
    },
}
