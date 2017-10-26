/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Jaime Rosales 2017 - Forge Developer Partner Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////


/// WHY I'M USING GLOBAL VARIABLES, SIMPLE I'M SETTING UP WITH REACT-SCRIPTS FOR EASIER 3RD PARTY DEVELOPER USE OF PROJECT
/// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#using-global-variables
const Autodesk = window.Autodesk;
import Client from '../Client'
var viewer;
var getToken = { accessToken: Client.getaccesstoken()};

function launchViewer (documentId) {
        getToken.accessToken.then((token) => { 
            var options = {
                env: 'AutodeskProduction',
                accessToken: token.access_token
            };

            var viewerDiv = document.getElementById('viewerDiv');
            viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
            
            Autodesk.Viewing.Initializer(options, function onInitialized(){
                Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
            });
        })
    }

/**
 * Autodesk.Viewing.Document.load() success callback.
 * Proceeds with model initialization.
 */

 function onDocumentLoadSuccess(doc) {

            // A document contains references to 3D and 2D viewables.
            var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry', 'role' : '3d'}, true);
            if (viewables.length === 0) {
                console.error('Document contains no viewables.');
                return;
            }

            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, onGeometryLoadedHandler);
            viewer.prefs.tag('ignore-producer');

            // Choose any of the avialble viewables
            var initialViewable = viewables[0];
            var svfUrl = doc.getViewablePath(initialViewable);
            var modelOptions = {
                sharedPropertyDbPath: doc.getPropertyDbPath()
            };

           
            viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
        }

        /**
         * Autodesk.Viewing.Document.load() failuire callback.
         */
         function onDocumentLoadFailure(viewerErrorCode) {
            console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
        }

        /**
         * viewer.loadModel() success callback.
         * Invoked after the model's SVF has been initially loaded.
         * It may trigger before any geometry has been downloaded and displayed on-screen.
         */
         function onLoadModelSuccess(model) {
            console.log('onLoadModelSuccess()!');
            console.log('Validate model loaded: ' + (viewer.model === model));
            console.log(model);
        }

        /**
         * viewer.loadModel() failure callback.
         * Invoked when there's an error fetching the SVF file.
         */
         function onLoadModelError(viewerErrorCode) {
            console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
        }

//////////////////////////////////////////////////////////////////////////
// Model Geometry loaded callback
//
//////////////////////////////////////////////////////////////////////////
    function onGeometryLoadedHandler (event) {
        event.target.model = event.model
        viewer = event.target;
        viewer.removeEventListener(
                Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                this.onGeometryLoadedHandler);
        viewer.setQualityLevel(false,false);
        viewer.setGroundShadow(false);
        viewer.showAll();
        viewer.fitToView();
    }

const Helpers = {
  launchViewer
};

export default Helpers;