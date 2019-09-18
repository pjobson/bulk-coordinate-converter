'use strict';

import { CoordinateConversion } from './coordinate-conversion.js';
import { discernType } from './type-detect.js';

const bcc = {
  coordsIn: [],
  coordOut: [],
  init: () => {
    bcc.addEvents();
  },
  addEvents: () => {
    document.getElementById('dooeet').addEventListener('click', bcc.dooeet);
  },
  dooeet: () => {
    bcc.coordsIn = document.getElementById('input').value // textarea value
                           .split(/[\r\n]/)               // split on carriage return
                           .map(coord => coord.trim())    // trim strings
                           .filter(Boolean)               // remove blanks
    // Clear out the out array
    bcc.coordOut = [];
    // loop the input array
    bcc.coordsIn.forEach(coord => {
      // split on lat lng
      const [lat, lng] = coord.split( /(?:\s*,\s*|\s{2,}|\t+)/ );
      // discern the type of the input
      const type = discernType(lat, lng);

      // Setup a new conversion for this input
      const cc = new CoordinateConversion();
      switch (type) {
        case 'UTM':
          cc.setUTM(coord);
          break;
        case 'MGRS':
          cc.setMGRS(coord);
          break;
        case 'DD':
          cc.setDD({ lat: lat, lng: lng });
          break;
        case 'DDM':
          cc.setDDM({ lat: lat, lng: lng });
          break;
        case 'DMS':
          cc.setDMS({ lat: lat, lng: lng });
          break;
        default: break;
      }

      // create an out object
      const out = {
        type:  type,
        input: coord,
        MGRS:    (type === 'INVALID') ? null : cc.MGRS.gridReference,
        UTM:     (type === 'INVALID') ? null : cc.UTM.display,
        DD_LAT:  (type === 'INVALID') ? null : cc.DD.lat,
        DD_LNG:  (type === 'INVALID') ? null : cc.DD.lng,
        DDM_LAT: (type === 'INVALID') ? null : cc.DDM.lat.display,
        DDM_LNG: (type === 'INVALID') ? null : cc.DDM.lng.display,
        DMS_LAT: (type === 'INVALID') ? null : cc.DMS.lat.display,
        DMS_LNG: (type === 'INVALID') ? null : cc.DMS.lng.display
      };

      // fill up the output array
      bcc.coordOut.push(out);
    });

    // convert to a table & json
    bcc.tablify();
    bcc.jsonify();
    bcc.showMe();
  },
  showMe: () => {
    document.getElementById('results').style.display = 'block';
  },
  jsonify: () => {
    const json = JSON.stringify(bcc.coordOut);
    document.getElementById('json').value = json;
  },
  tablify: () => {
    const tb = document.getElementById('tb');

    // empty table
    while (tb.getElementsByTagName('tr').length > 0) {
      tb.removeChild(tb.getElementsByTagName('tr')[0]);
    }

    // loop the coords
    bcc.coordOut.forEach((coord, index) => {
      // Build elements the old fashioned way
      const tr = document.createElement('tr');
            tr.setAttribute('class', coord.type);
      const idxTD = document.createElement('td');
            idxTD.appendChild(document.createTextNode(index+1));
      const typeTD = document.createElement('td');
            typeTD.appendChild(document.createTextNode(coord.type));
      const inputTD = document.createElement('td');
            inputTD.appendChild(document.createTextNode(coord.input));
      const mgrsTD = document.createElement('td');
            mgrsTD.appendChild(document.createTextNode(coord.MGRS));
      const utmTD = document.createElement('td');
            utmTD.appendChild(document.createTextNode(coord.UTM));
      const ddlatTD = document.createElement('td');
            ddlatTD.appendChild(document.createTextNode(coord.DD_LAT));
      const ddlngTD = document.createElement('td');
            ddlngTD.appendChild(document.createTextNode(coord.DD_LNG));
      const ddmlatTD = document.createElement('td');
            ddmlatTD.appendChild(document.createTextNode(coord.DDM_LAT));
      const ddmlngTD = document.createElement('td');
            ddmlngTD.appendChild(document.createTextNode(coord.DDM_LNG));
      const dmslatTD = document.createElement('td');
            dmslatTD.appendChild(document.createTextNode(coord.DMS_LAT));
      const dmslngTD = document.createElement('td');
            dmslngTD.appendChild(document.createTextNode(coord.DMS_LNG));
      // append the new elements
      tr.appendChild(idxTD);
      tr.appendChild(typeTD);
      tr.appendChild(inputTD);
      tr.appendChild(mgrsTD);
      tr.appendChild(utmTD);
      tr.appendChild(ddlatTD);
      tr.appendChild(ddlngTD);
      tr.appendChild(ddmlatTD);
      tr.appendChild(ddmlngTD);
      tr.appendChild(dmslatTD);
      tr.appendChild(dmslngTD);
      tb.appendChild(tr);
    });
  }
};

window.addEventListener('load', bcc.init());
