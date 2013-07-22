const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const Lib = Extension.imports.lib;

const schema = "org.gnome.shell.extensions.TaskBar";

function init()
{

}

function buildPrefsWidget()
{
    let prefs = new Prefs(schema);

    return prefs.buildPrefsWidget();
}

function Prefs(schema)
{
    this.init(schema);
}

Prefs.prototype =
{
    settings: null,

    init: function(schema)
    {
	let settings = new Lib.Settings(schema);
	
	this.settings = settings.getSettings();
    },

    changeRemoveApplicationMenu: function(object, pspec)
    {
	this.settings.set_boolean("remove-default-application-menu", object.active);
    },

    changeDisplayDesktopButton: function(object, pspec)
    {
	this.settings.set_boolean("display-desktop-button", object.active);
    },

    changeCloseButton: function(object, pspec)
    {
	this.settings.set_boolean("close-button", object.active);
    },

    changeDisplayPreview: function(object, pspec)
    {
	this.settings.set_boolean("display-preview", object.active);
    },

    changePreviewSize: function(object, valuePreviewSize)
    {
	this.settings.set_int("preview-size", valuePreviewSize.get_value());
    },

    changePreviewDelay: function(object, valuePreviewDelay)
    {
	this.settings.set_int("preview-delay", valuePreviewDelay.get_value());
    },

    buildPrefsWidget: function()
    {
	let frame = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, border_width: 10});

	let label = new Gtk.Label({ label: "<b>Global</b>", use_markup: true, xalign: 0});
	let vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, margin_left: 20});



	let hboxRemoveApplicationMenu = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelRemoveApplicationMenu = new Gtk.Label({label: "Remove Default Application Menu", xalign: 0});
	let valueRemoveApplicationMenu = new Gtk.Switch({active: this.settings.get_boolean("remove-default-application-menu")});
	valueRemoveApplicationMenu.connect('notify::active', Lang.bind(this, this.changeRemoveApplicationMenu));

	hboxRemoveApplicationMenu.pack_start(labelRemoveApplicationMenu, true, true, 0);
	hboxRemoveApplicationMenu.add(valueRemoveApplicationMenu);
	vbox.add(hboxRemoveApplicationMenu);



	let hboxDisplayDesktopButton = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelDisplayDesktopButton = new Gtk.Label({label: "Display Desktop Button", xalign: 0});
	let valueDisplayDesktopButton = new Gtk.Switch({active: this.settings.get_boolean("display-desktop-button")});
	valueDisplayDesktopButton.connect('notify::active', Lang.bind(this, this.changeDisplayDesktopButton));

	hboxDisplayDesktopButton.pack_start(labelDisplayDesktopButton, true, true, 0);
	hboxDisplayDesktopButton.add(valueDisplayDesktopButton);
	vbox.add(hboxDisplayDesktopButton);



	let hboxCloseButton = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelCloseButton = new Gtk.Label({label: "Middle Click Close task", xalign: 0});
	let valueCloseButton = new Gtk.Switch({active: this.settings.get_boolean("close-button")});
	valueCloseButton.connect('notify::active', Lang.bind(this, this.changeCloseButton));

	hboxCloseButton.pack_start(labelCloseButton, true, true, 0);
	hboxCloseButton.add(valueCloseButton);
	vbox.add(hboxCloseButton);



	frame.add(label);
	frame.add(vbox);

	label = new Gtk.Label({ label: "<b>Preview</b>", use_markup: true, xalign: 0 });
	vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, margin_left: 20 });



	let hboxDisplayPreview = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelDisplayPreview = new Gtk.Label({label: "Display Preview", xalign: 0});
	let valueDisplayPreview = new Gtk.Switch({active: this.settings.get_boolean("display-preview")});
	valueDisplayPreview.connect('notify::active', Lang.bind(this, this.changeDisplayPreview));

	hboxDisplayPreview.pack_start(labelDisplayPreview, true, true, 0);
	hboxDisplayPreview.add(valueDisplayPreview);
	vbox.add(hboxDisplayPreview);



	let hboxPreviewSize = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelPreviewSize = new Gtk.Label({label: "Preview size ", xalign: 0});
	let valuePreviewSize = new Gtk.Adjustment({lower: 100, upper: 1000, step_increment: 50});
	let value2PreviewSize = new Gtk.SpinButton({adjustment: valuePreviewSize, snap_to_ticks: true});
	value2PreviewSize.set_value(this.settings.get_int("preview-size"));
	value2PreviewSize.connect("value-changed", Lang.bind(this, this.changePreviewSize, valuePreviewSize));

	hboxPreviewSize.pack_start(labelPreviewSize, true, true, 0);
	hboxPreviewSize.add(value2PreviewSize);

	vbox.add(hboxPreviewSize);



	let hboxPreviewDelay = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
	let labelPreviewDelay = new Gtk.Label({label: "Delay before Preview (milliseconds)", xalign: 0});
	let valuePreviewDelay = new Gtk.Adjustment({lower: 0, upper: 3000, step_increment: 250});
	let value2PreviewDelay = new Gtk.SpinButton({adjustment: valuePreviewDelay, snap_to_ticks: true});
	value2PreviewDelay.set_value(this.settings.get_int("preview-delay"));
	value2PreviewDelay.connect("value-changed", Lang.bind(this, this.changePreviewDelay, valuePreviewDelay));

	hboxPreviewDelay.pack_start(labelPreviewDelay, true, true, 0);
	hboxPreviewDelay.add(value2PreviewDelay);

	vbox.add(hboxPreviewDelay);



	frame.add(label);
	frame.add(vbox);
	frame.show_all();
	
	return frame;
    }
}
