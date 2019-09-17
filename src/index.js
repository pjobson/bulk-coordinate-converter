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
        MGRS:  (type === 'INVALID') ? '' : cc.MGRS.gridReference,
        DD:    (type === 'INVALID') ? '' : `${cc.DD.lat}, ${cc.DD.lng}`,
        DDM:   (type === 'INVALID') ? '' : `${cc.DDM.lat.display}, ${cc.DDM.lng.display}`,
        DMS:   (type === 'INVALID') ? '' : `${cc.DMS.lat.display}, ${cc.DMS.lng.display}`
      };

      // fill up the output array
      bcc.coordOut.push(out);
    });

    // convert to a table & json
    bcc.tablify();
    bcc.jsonify();
  },
  jsonify: () => {
    const json = JSON.stringify(bcc.coordOut);
    document.getElementById('json').value = json;
    document.getElementById('json').style.display = 'inline';
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
      const idxTD = document.createElement('td');
            idxTD.appendChild(document.createTextNode(index+1));
      const typeTD = document.createElement('td');
            typeTD.appendChild(document.createTextNode(coord.type));
      const inputTD = document.createElement('td');
            inputTD.appendChild(document.createTextNode(coord.input));
      const mgrsTD = document.createElement('td');
            mgrsTD.appendChild(document.createTextNode(coord.MGRS));
      const ddTD = document.createElement('td');
            ddTD.appendChild(document.createTextNode(coord.DD));
      const ddmTD = document.createElement('td');
            ddmTD.appendChild(document.createTextNode(coord.DDM));
      const dmsTD = document.createElement('td');
            dmsTD.appendChild(document.createTextNode(coord.DMS));
      // append the new elements
      tr.appendChild(idxTD);
      tr.appendChild(typeTD);
      tr.appendChild(inputTD);
      tr.appendChild(mgrsTD);
      tr.appendChild(ddTD);
      tr.appendChild(ddmTD);
      tr.appendChild(dmsTD);

      tb.appendChild(tr);
    });

    document.getElementById('ctable').style.display = 'block';
  }
};

window.addEventListener('load', bcc.init());
