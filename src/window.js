/* window.js
 *
 * Copyright 2020 Jevgeni Sillar
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { GObject, Gtk, Soup } = imports.gi;
const Lang = imports.lang;


const ListBoxRowWithData = Lang.Class({
    Name: "ListBoxRowWithData",
    Extends: Gtk.ListBoxRow,

    _init: function(data) {
        this.parent();
        this.data = data;


        this.box = new Gtk.Box({ spacing: 6 });

        this.check = new Gtk.CheckButton();
        this.check.set_margin_left(10);
        this.check.set_margin_right(10);

        this.label = new Gtk.Label({ label: data });

        this.label.set_margin_top(10);
        this.label.set_margin_bottom(10);

        this.box.pack_start(this.check, false, false, 0);
        this.box.pack_start(this.label, false, false, 0);

        this.add(this.box);

        //this.add(new Gtk.Label({label: data}));
    }
});

let _session = new Soup.SessionAsync();

function GET(url, callback) {
    let request = Soup.Message.new('GET', url);

    _session.queue_message(request, Lang.bind(this, function(session, message) {
      callback(message.status_code, request.response_body.data);
    }
   )
);
}

var FlatlistWindow = GObject.registerClass({
    GTypeName: 'FlatlistWindow',
    Template: 'resource:///io/pitfire/Flatlist/window.ui',
    InternalChildren: ['listBox']
}, class FlatlistWindow extends Gtk.ApplicationWindow {
    _init(application) {
        super._init({ application });

        const flathubApi = 'https://flathub.org/api/v1/apps';
        const flathubRecents = 'https://flathub.org/api/v1/apps/collection/recently-updated';

        //[1, 2, 3, 4].forEach(item => this._listBox.add(new ListBoxRowWithData(item.toString())));

        GET(flathubRecents, (status, body) => {
          const data = JSON.parse(body);

          //data.forEach(item => log(item.name));

          data.forEach(item => this._listBox.add(new ListBoxRowWithData(item.name)));

          this._listBox.show_all();
        });

        _session

        this._listBox.show_all();
    }
});

