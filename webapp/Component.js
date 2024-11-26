sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/wakefern/zflexcl/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/f/FlexibleColumnLayoutSemanticHelper",
	"sap/f/library"
],
    function (UIComponent, Device, models, JSONModel, FlexibleColumnLayoutSemanticHelper, fioriLibrary) {
        "use strict";

        return UIComponent.extend("com.wakefern.zflexcl.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                var oModel,
				 
				oRouter;

                var oProductsModel; var oProductsModelPath;
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                oModel = new JSONModel();
                this.setModel(oModel);
                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                // ProductsModel
                // var oProductsModel;
                // set products demo model on this sample
                // not able to reach the sample
                oProductsModelPath = sap.ui.require.toUrl("com/wakefern/zflexcl/model/Products.json");
                // oProductsModel = new JSONModel(sap.ui.require.toUrl('com/wakefern/zflexcl/model') + '/products.json');
                // Set products demo model from local database
                  var oProductsModel = new JSONModel();
		          oProductsModel.loadData(oProductsModelPath);
		        // end of local set
                oProductsModel.setSizeLimit(1000);
                this.setModel(oProductsModel, 'products');
                // enable routing
                oRouter = this.getRouter();
			    oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();
               // this.getRouter().initialize();
            },
            getHelper: function () {
                return this._getFcl().then(function(oFCL) {
                    var oSettings = {
                        defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                        defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded
                    };
                    return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
                });
            },
            _onBeforeRouteMatched: function(oEvent) {
                var oModel = this.getModel(),
                    sLayout = oEvent.getParameters().arguments.layout,
                    oNextUIState;
    
                // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
                if (!sLayout) {
                    this.getHelper().then(function(oHelper) {
                        oNextUIState = oHelper.getNextUIState(0);
                        oModel.setProperty("/layout", oNextUIState.layout);
                    });
                    return;
                    // sLayout = fioriLibrary.LayoutType.OneColumn;
                }
    
                oModel.setProperty("/layout", sLayout);
            },

            _getFcl: function () {
                return new Promise(function(resolve, reject) {
                    var oFCL = this.getRootControl().byId('flexibleColumnLayout');
                    if (!oFCL) {
                        this.getRootControl().attachAfterInit(function(oEvent) {
                            resolve(oEvent.getSource().byId('flexibleColumnLayout'));
                        }, this);
                        return;
                    }
                    resolve(oFCL);
    
                }.bind(this));
            }
    
        });
    }
);