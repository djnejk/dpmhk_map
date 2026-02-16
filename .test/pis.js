/// <reference path="../../shared/js/wertyz.js" />

pis = {};

pis.localization = new function()
{
    let _texts = [];
    let localizationShorthand = null;

    this.setTexts = (texts) =>
    {
        _texts = texts;
    };

    this.getText = (key) =>
    {
        const text = _texts[key];

        if (text !== undefined)
            return text;

        return key;
    };
    
    this.getTexts = () => 
    {
        return _texts;
    }

    this.getLocalizationShorthand = () => {
        return localizationShorthand;
    }

    this.setLocalizationShorthand = (short) => {
        localizationShorthand = short;
    }
};


//#region pis.classes

pis.View = function()
{
    this.State = {
        EMPTY: 0,

        //Lines crossing the stop
        STOP_LINES: 1,

        //Search list with all results
        SEARCH_RESULT_TEXT: 2,
        SEARCH_RESULT_CITY: 4,
        SEARCH_RESULT: 6,
        MAIN: 7,

        //Line detail
        LINE: 8,
        DETAIL: 8, //TEMPORARILY THE SAME AS LINE
        VEHICLE: 16,
        LINE_SCHEDULES: 8

    };

    let _state = this.State.EMPTY;
    let _referenceValue = null;

    this.set = (state, referenceValue) =>
    {
        _state = state;
        _referenceValue = referenceValue;
    };

    this.reset = () =>
    {
        _state = this.State.EMPTY;
        _referenceValue = null;
    };

    this.getState = () =>
    {
        return _state;
    };

    this.hasState = (state) =>
    {
        return (state & _state) > 0;
    };

    this.getReferenceValue = () =>
    {
        return _referenceValue;
    };

    this.showStage = (stage) =>
    {
        switch (stage)
        {
            case "main":
                $searchResultMain.fadeIn();
                break;
            case "detail":
                $searchResultDetail.fadeIn();
                break;
        }

    };

    this.hideStage = (stage) =>
    {
        switch (stage)
        {
            case "main":
                $searchResultMain.hide();
                break;
            case "detail":
                $searchResultDetail.hide();
                break;
        }

    };

    this.toggleStages = () =>
    {
        const isMainVisible = $searchResultMain.is(":visible");

        $searchResultMain.toggle(!isMainVisible);
        $searchResultDetail.toggle(isMainVisible);
    };

    this.flushStages = () =>
    {
        $searchResultMain.empty();
        $searchResultMain.hide();
        $searchResultDetail.empty();
        $searchResultDetail.hide();
    };
};

//bit flags
pis.SearchType = {
    LINES: 1,
    STOPS: 2,
    CITY: 4,
    ALL: 7
}

//bit flags
pis.TransportType = {
    BUS: 1,
    TRAM: 2,
    TROLLEY: 4,
    ALL: 7
}

pis.transportType = {};

pis.transportType.getForVehicle = (vehicleKind) =>
{
    switch (vehicleKind)
    {
        case 63:
            return pis.TransportType.BUS;
        case 1742:
            return pis.TransportType.TROLLEY;
        case 1034:
            return pis.TransportType.TRAM;
        default:
            return pis.TransportType.BUS;
    }
};

pis.transportType.getForLine = (lineKind) =>
{
    switch (lineKind)
    {
        case 0:
            return pis.TransportType.TRAM;
        case 3:
            return pis.TransportType.BUS;
        case 800:
            return pis.TransportType.TROLLEY;
        default:
            return pis.TransportType.BUS;
    }
};

pis.transportType.getForStop = (platformKind) =>
{
    switch (platformKind)
    {
        case 30:
            return pis.TransportType.BUS;
        case 31:
            return pis.TransportType.TRAM;
        // case 32:
        //     return pis.TransportType.KOLEJ; //???
        case 33:
            return pis.TransportType.TROLLEY;
        default:
            return pis.TransportType.BUS;
    }
};

pis.transportType.getAllForStop = (platformKinds) =>
{
    let allPlatformKinds = 0;

    platformKinds.forEach(pk => 
    {
        allPlatformKinds |= pis.transportType.getForStop(pk);
    });

    return allPlatformKinds;

    // //TODO Nie je to zle, ale je to skarede. A co je skarede, je skoro zle.
    // const hasT = stopPlatformName.indexOf("t") > -1;

    // if (hasT)
    // {
    //     return pis.TransportType.TRAM;
    // }

    // //trolejbusove = busove
    // return pis.TransportType.BUS | pis.TransportType.TROLLEY;
};

pis.transportType.getColor = (transportType) =>
{
    switch (transportType)
    {
        case pis.TransportType.BUS:
            return "#ffdd00";
        case pis.TransportType.TRAM:
            return "#e30613";
        case pis.TransportType.TROLLEY:
            return "#95c11f";
        default:
            return "#ffdd00";
    }
};

//#endregion

// #region pis.settings

pis.settings = {}

pis.settings.skin = "default";

pis.settings.map = {};

pis.settings.map.contentUrl = "";

pis.settings.printStyleUrl = "";

pis.settings.vehiclesOnStart = false;

pis.settings.virtualization = true;

pis.settings.showInvoice = true;

pis.settings.account = true;

pis.settings.timeschedules = true;

pis.settings.anonymousSale = false;

pis.settings.parking = false;

pis.settings.showHintOnStart = false;

pis.settings.mapBboxCoordinates =  null;

pis.settings.mapVehicleLineToLineNumberText = false;

// #endregion

// #region pis.data

pis.data = {};

pis.data.lines = [];

pis.data.vehicles = [];

pis.data.places = [];

pis.data.lineNumberMap = new Map();

pis.data.getLine = (id) =>
{
    return pis.data.lines.find(l => l.id === id);
};

pis.data.getLineByLineNumberText = (lineNumberText) =>
{
    let index = pis.data.lines.findIndex(l => l.lineNumberText === lineNumberText);

    if(index > 0) {
        return pis.data.lines[index];
    }

    index = pis.data.lines.findIndex(l => l.lineNumber === +lineNumberText);

    if(index > 0) {
        return pis.data.lines[index];
    }

    return [];
};

pis.data.getLineByLineId = (lineId) => {
    let index = pis.data.lines.findIndex(l => l.id === lineId);

    if(index > 0) {
        return pis.data.lines[index];
    }

    return [];
}

pis.data.getLineName = (line, direction) =>
{
    let lineName = "";
    const directionName = direction !== 0
        ? "forward"
        : "backward";

    if (line.places && line.places[directionName])
    {        
        lineName = `${ line.places[directionName].startPlatformName } - ${ line.places[directionName].endPlatformName }`;
    }
    else if (line.startName || line.endName)
    {
        lineName = `${ line.startName } - ${ line.endName }`;
    }

    return lineName;
}

pis.data.getRoute = (lineId, routeId) =>
{
    let line = pis.data.getLine(lineId);

    return line.routes.find(r => r.id === routeId);
};

pis.data.getRouteSegment = (route, segmentPointId) =>
{
    const segment = route.segments.find(segment =>
        segment.points.some(segmentPoint => segmentPoint.segmentPointId === segmentPointId));

    return segment;
};

pis.data.getVehicle = (id) =>
{
    return pis.data.vehicles.find(vehicle => vehicle.vid === id);
};

pis.data.getVehicleByVin = (vin) =>
{
    return pis.data.vehicles.find(vehicle => vehicle.b === vin);
};

pis.data.getVehicleByObuNumber = (obuNumber) =>
{
    return pis.data.vehicles.find(vehicle => vehicle.o === obuNumber);
};

pis.data.getStop = (stopId) =>
{
    return pis.data.stops.find(stop => stop.id === stopId);
};

// #region pis.ajax

pis.ajax = {};

// #endregion

// #endregion

// #region pis.map

pis.map = {};

pis.map.GeolocationProcessor = class
{
    feature = null;
    accuracyFeature = null;
    coordinates = [];
    geolocation = null;
    layer = null;
    wasFit = false;
    mapExtender = null;
    fit = false;
    isGeolocation = false;
    color = '#3399CC';
    self = this;
    mapBox = null;
    
    constructor (mapExtender, options) {
        if(options) {
            this.fit = options.fit ?? false;
            this.color = options.color ?? '#3399CC';
            this.mapBox = options.mapBox ?? null;
        }

        if(mapExtender) {
            this.mapExtender = mapExtender;
            this.createInstance();
            this.obtainCoordinates();
            this.createFeature();
            this.createLayer();

            this.geolocation.on('change', () => {
                this.updateCoordinates();
            });
        }
    }

    obtainCoordinates () {
        if(this.geolocation) {
            this.coordinates = this.geolocation.getPosition();
        }
    }

    createInstance () {
        this.geolocation = new ol.Geolocation({
            tracking: true,
            projection: this.mapExtender.getMap().getView().getProjection()
        });
    }

    createLayer () {
        this.layer = new ol.layer.Vector({
            name: 'GeolocationLayer',
            map: this.mapExtender.getMap(),
            source: new ol.source.Vector({
                features: [this.feature, this.accuracyFeature]
            })
        })
    }

    createFeature () {
        const style = new ol.style.Style ({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({
                    color: this.color
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        });

        this.feature = new ol.Feature({
            geometry: new ol.geom.Point(this.coordinates ? this.coordinates : [])
        });

        const accuracyStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: this.color,
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            })
        })

        this.accuracyFeature = new ol.Feature({
            
        })

        this.feature.setStyle(style);
        this.accuracyFeature.setStyle(accuracyStyle);
    }

    updateCoordinates () {
        this.coordinates = this.geolocation.getPosition();
        this.updateFeature();

        if(this.coordinates && Array.isArray(this.coordinates) && this.coordinates.length === 2) {
            this.isGeolocation = true;
        }

        if(!this.wasFit && this.fit) {

            if((this.mapBox && this.isCoordinatesInsideBox(this.mapBox)) || !this.mapBox) {
                this.fitFeature();
                this.wasFit = true;
            }
        }
    }

    updateFeature () {
        this.feature.setGeometry(this.coordinates ? new ol.geom.Point(this.coordinates) : []);
        this.accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
    }

    getIsGeolocation () {
        return this.isGeolocation;
    }

    fitFeature () {
        const extent = this.feature.getGeometry().getExtent();
        this.mapExtender.fit(extent, {
            maxZoom: Math.max(18, this.mapExtender.getZoom()),
        });
    }

    isCoordinatesInsideBox (box) {
        if(this.coordinates) {
            const lonLat = ol.proj.toLonLat(this.coordinates);
            return wertyz.gps.isPointInsideRectangle(lonLat, [+box[0], +box[1]], [+box[2], +box[3]]);
        }

        return false;
    }
}

pis.map.VehicleProcessor = class
{
    constructor(mapExtender, options)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);
        options = options ||
        {};

        const self = this;
        this._mapExtender = mapExtender;
        this._map = mapExtender.getMap();
        this._vehicles = [];
        this._vehicleSource = null;
        this._vehicleLayer = null;
        this._vehicleFeatures = new ol.Collection();

        this._styleGenerator = new function()
        {
            this.getStyle = function(feature)
            {
                const styles = [];
                let size = 1;

                if (options.cluster)
                {
                    const features = feature.get("features");
                    size = features.length;

                    if (size === 1)
                    {
                        feature = features[0];
                    }
                }

                if (size === 1)
                {
                    let transportType = feature.get("transportType");                    

                    if (options.colorIcons)
                    {
                        let iconName = pis.map.style.getIconNameForVehicle(transportType);                       

                        styles.push(new ol.style.Style(
                        {
                            image: new ol.style.Icon(
                            {
                                size: [28, 28],
                                src: `${pis.settings.map.contentUrl}/${iconName}.png`
                            })
                        }));
                    }
                    else
                    {   
                        const isPlan = transportType === 999;

                        if (isPlan)
                        {
                            const lineNumberText = feature.get("lineNumber");
                            const line = pis.data.getLineByLineNumberText(lineNumberText);
                            transportType = pis.transportType.getForLine(line.lineKind);
                        }

                        const color = isPlan
                            ? "#888"
                            : "#1a5d5c";

                        const circleStyle = new ol.style.Style(
                        {
                            image: new ol.style.Circle(
                            {
                                radius: 14,
                                fill: new ol.style.Fill(
                                {
                                    color: "#ffffffcc"
                                }),
                                stroke: new ol.style.Stroke(
                                {
                                    width: 1,
                                    color: color
                                })
                            })
                        });

                        if (isPlan)
                        {
                            //circleStyle.getImage().setOpacity(0.5);
                        }

                        styles.push(circleStyle);                       

                        if (transportType === pis.TransportType.BUS)
                        {
                            styles.push(new ol.style.Style(
                            {
                                text: new ol.style.Text(
                                {
                                    text: "\ue032",
                                    font: "normal 14px 'Glyphicons Regular'",
                                    textAlign: "center",
                                    offsetY: 2,
                                    fill: new ol.style.Fill(
                                    {
                                        color: color
                                    })
                                })
                            }));
                        }
                        else if ((transportType === pis.TransportType.TROLLEY) || transportType === pis.TransportType.TRAM)
                        {
                            let iconName = "trolley";
                            let displacement = [0, 2];

                            if (transportType === pis.TransportType.TRAM)
                            {
                            
                                iconName = "tram";
                                displacement = [-2, 0];
                            }

                            if (isPlan)
                            {
                                iconName += "Plan";
                            }

                            styles.push(new ol.style.Style(
                            {
                                image: new ol.style.Icon(
                                {
                                    size: [16, 21],
                                    displacement: displacement,                              
                                    src: `${pis.settings.map.contentUrl}/${iconName}.png`
                                    //src: pis.settings.map.contentUrl + "/vehicle.png"
                                })
                            }));                            
                        }
                    }

                    if (options.colorIcons)
                    {
                        const regularShape = pis.map.style.getAzimuthRegularShape(
                            feature.get("azimuth"),
                            20,
                            pis.transportType.getColor(transportType));

                        styles.push(new ol.style.Style(
                        {
                            image: regularShape
                        }));
                    }

                    styles.push(new ol.style.Style(
                    {
                        text: new ol.style.Text(
                        {
                            text: feature.get("lineNumber"),
                            font: "bold 10px Arial",
                            textAlign: "center",
                            offsetY: -23,
                            padding: [1, 2, 1, 2],
                            fill: new ol.style.Fill(
                            {
                                color: "#333"
                            }),
                            backgroundFill: new ol.style.Fill(
                            {
                                color: "#ffffffcc"
                            })
                        })
                    }));
                }
                else
                {
                    styles.push(new ol.style.Style(
                    {
                        image: new ol.style.Circle(
                        {
                            radius: 14,
                            fill: new ol.style.Fill(
                            {
                                color: "#009899"
                            }),
                            stroke: new ol.style.Stroke(
                            {
                                width: 2,
                                color: "#fff"
                            })
                        }),
                        text: new ol.style.Text(
                        {
                            text: size.toString(),
                            font: "bold 12px 'Source Sans Pro'",
                            textAlign: "center",
                            fill: new ol.style.Fill(
                            {
                                color: "#fff"
                            })
                        })
                    }));
                }

                return styles;
            };
        };

        this._init = () =>
        {
            let vehicleLayer;
            let vehicleSource;

            if (options.cluster)
            {
                vehicleSource = new ol.source.Cluster(
                {
                    distance: options.clusterDistance || 20,
                    source: new ol.source.Vector()
                });
                vehicleSource.on("change", function(e)
                {
                    self.event.call("clusterchange", e);
                });

                vehicleLayer = new ol.layer.AnimatedCluster(
                {
                    name: "Vehicles",
                    source: vehicleSource,
                    animationDuration: 200,
                    zIndex: 3,
                    style: self._styleGenerator.getStyle
                });
            }
            else
            {
                vehicleSource = new ol.source.Vector(
                {
                    features: self._vehicleFeatures
                });

                vehicleLayer = new ol.layer.Vector(
                {
                    name: "Vehicles",
                    source: vehicleSource,
                    zIndex: 3,
                    style: self._styleGenerator.getStyle
                });
            }

            if (options.minZoom)
            {
                vehicleLayer.setMinZoom(options.minZoom);
            }

            self._vehicleSource = vehicleSource;
            self._vehicleLayer = vehicleLayer;
            self._map.addLayer(vehicleLayer);
        };

        this.setVehicles = function(vehicles)
        {
            self._vehicles = vehicles;
            self._vehicleFeatures.clear();

            for (let i = 0; i < vehicles.length; i++)
            {
                const vehicle = vehicles[i];

                if(vehicle.ln && vehicle.ln !== 'Přejezd') //TODO zatial natvrdo prejezd
                {

                    const feature = new ol.Feature(
                    {
                        id: vehicle.vid,
                        transportType: pis.transportType.getForVehicle(vehicle.tv),
                        latitude: vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR,
                        longitude: vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR,
                        azimuth: vehicle.az,
                        lineNumber: vehicle?.lnh ?? vehicle.ln,
                        nextStopName: vehicle.nextStopName,
                        timeToNextStopInSec: vehicle.timeToNextStopInSec,
                        delay: vehicle.delay,
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR,
                            vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR
                        ]))
                    });

                    self._vehicleFeatures.push(feature);
                }
            }

            if (options.cluster)
            {
                self._vehicleSource.getSource().clear();
                self._vehicleSource.getSource().addFeatures(self._vehicleFeatures.getArray());
            }
        };

        this.getMap = function()
        {
            return self._map;
        };

        this.getFeature = function(vehicleId)
        {
            let feature = self._vehicleFeatures.getArray().find(s => s.get("id") === vehicleId);

            return feature;
        };

        this.getExtent = function()
        {
            if (options.cluster)
            {
                return self._vehicleSource.getSource().getExtent();
            }

            return self._vehicleSource.getExtent();
        };

        this.getResolution = function(coords)
        {
            let view = self._map.getView();
            let resolution = view.getResolution();
            let projection = view.getProjection();

            if (!coords)
                coords = view.getCenter();

            let resolutionAtCoords = projection.getPointResolution(resolution, coords);

            return resolutionAtCoords;
        };

        this.hasVehicleFeature = (feature) =>
        {
            return self._vehicleFeatures.getArray().some(f => f === feature);
        }

        this.fit = function(options)
        {
            if (!self._vehicleFeatures.getLength())
            {
                self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
                self._map.getView().setZoom(2);

                return;
            }

            let extent = self.getExtent();
            self._map.getView().fit(extent, options);
        };

        this.zoomAnimate = function(options)
        {
            self._map.getView().animate(options);
        }

        this.show = function()
        {
            self._vehicleLayer.setVisible(true);
        };

        this.hide = function()
        {
            self._vehicleLayer.setVisible(false);
        };

        this.clear = function()
        {
            self._vehicleFeatures.clear();
            self._vehicles = [];
        };

        this.isShown = function()
        {
            return self._vehicleLayer.getVisible();
        }

        this._init();
    };
};

pis.map.StopProcessor = class
{
    constructor(mapExtender, options)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);
        options = options ||
        {};

        let self = this;
        this._mapExtender = mapExtender;
        this._map = mapExtender.getMap();
        this._stopPlatforms = [];
        this._stopPlatformSource = null;
        this._stopPlatformLayer = null;
        this._stopPlatformFeatures = new ol.Collection();
        this._stops = new Map(); //Stop platforms grouped by name => virtual stop       
        this._stopSource = null;
        this._stopLayer = null;
        this._stopFeatures = new ol.Collection();
        this._stopClusterSource = null;
        this._stopClusterLayer = null;

        this._styleGenerator = new function()
        {
            //TODO zjednotit, style je takmer rovnaky pre cluster

            this.clusterStyle = [];

            const innerCircle = new ol.style.Style(
            {
                image: new ol.style.Circle(
                {
                    radius: 14, //radius: 15,
                    fill: new ol.style.Fill(
                    {
                        color: options.clusterMainColor || "#555555aa"
                    }),
                    stroke: new ol.style.Stroke(
                    {
                        width: 2,
                        color: options.clusterStrokeColor || "#fff"                    
                    })                  
                }),
                text: new ol.style.Text(
                {                    
                    font: "bold 12px 'Source Sans Pro'",
                    textAlign: "center",                          
                    fill: new ol.style.Fill(
                    {
                        color: "#fff"
                    })
                })
            });

	        // const stroke = new ol.style.Style(
            // {
            //     image: new ol.style.Circle(
            //     {
            //         radius: 18,                   
            //         stroke: new ol.style.Stroke(
            //         {
            //             width: 6,
            //             color: options.clusterStrokeColor || "ffffffaa"                       
            //         })
            //     })
            // });

            //this.clusterStyle.push(stroke, innerCircle);
            this.clusterStyle.push(innerCircle);

            this.getStopPlatformStyle = function(feature)
            {
                const styles = [];
                let style;
                let size = 1;
                //const zoom = self._map.getView().getZoom();

                if (options.cluster)
                {
                    const features = feature.get("features");

                    if (features && features.length)
                    {
                        size = features.length;
                        feature = features[0];
                    }
                }

                if (size === 1)
                {
                    const transportType = feature.get("transportType");
                    //let iconName = pis.map.style.getIconNameForStop(transportType);                 

                    if (options.mztm)
                    {
                        style = new ol.style.Style(
                        {
                            // image: new ol.style.Icon(
                            // {
                            //     size: [28, 24],
                            //     src: `${pis.settings.map.contentUrl}/mztm/${iconName}.png`
                            // })                                                        
                            image: new ol.style.Circle(
                            {
                                radius: 6,
                                fill: new ol.style.Fill(
                                {
                                    color: "#273370" //"#d6006f"
                                }),
                                stroke: new ol.style.Stroke(
                                {
                                    width: 2,
                                    color: "#fff"
                                })                         
                            })
                        });                                       
                    }
                    else
                    {
                        style = new ol.style.Style(
                        {
                            image: new ol.style.Circle(
                            {
                                radius: 12,
                                fill: new ol.style.Fill(
                                {
                                    color: "#333"
                                }),
                                stroke: new ol.style.Stroke(
                                {
                                    width: 1,
                                    color: "#000"
                                })
                            }),
                            text: new ol.style.Text(
                            {
                                text: "\ue267",
                                font: "normal 10px 'Glyphicons Regular'",
                                textAlign: "center",
                                offsetY: 3,
                                fill: new ol.style.Fill(
                                {
                                    color: "white" //"#5bea68"
                                })
                            })                                                
                        })
                    }

                    styles.push(style);

                    let text = feature.get("name");

                    if (self._stops.get(feature.get("name")).length > 1)
                    {
                        text += " | " + feature.get("platform");
                    }

                    styles.push(new ol.style.Style(
                    {
                        text: new ol.style.Text(
                        {
                            text: text,
                            font: "bold 11px 'Source Sans Pro'",
                            textAlign: "center",
                            //offsetX: -10,
                            offsetY: -25,
                            padding: [3, 4, 3, 4],
                            fill: new ol.style.Fill(
                            {
                                color: "#333" //"#5bea68"
                            }),
                            backgroundFill: new ol.style.Fill(
                            {
                                color: "#ffffffcc" //"#5bea68"
                            }),
                            // backgroundStroke: new ol.style.Stroke(
                            // {
                            //     width: 2,
                            //     color: "#000"//"#5bea68"
                            // })
                        })
                    }));
                }
                else
                {
                    //const names = wertyz.helper.distinct(feature.get("features").map(f => f.get("name")));

                    self._styleGenerator.clusterStyle[0].getText().setText(size.toString());
                    return self._styleGenerator.clusterStyle;                   

                    // styles.push(new ol.style.Style(
                    //     {
                    //         text: new ol.style.Text(
                    //             {
                    //                 text: names.reduce((joined, name) => joined + "\n" + name),
                    //                 font: "bold 11px 'Source Sans Pro'",
                    //                 textAlign: "center",
                    //                 //offsetX: -10,
                    //                 offsetY: -25,
                    //                 padding: [3, 4, 3, 4],
                    //                 fill: new ol.style.Fill(
                    //                     {
                    //                         color: "#333" //"#5bea68"
                    //                     }),
                    //                 backgroundFill: new ol.style.Fill(
                    //                     {
                    //                         color: "#ffffffcc" //"#5bea68"
                    //                     }),
                    //                 // backgroundStroke: new ol.style.Stroke(
                    //                 // {
                    //                 //     width: 2,
                    //                 //     color: "#000"//"#5bea68"
                    //                 // })
                    //             })
                    //     }));
                }

                return styles;
            };

            this.getStopStyle = function(feature)
            {
                const styles = [];
                let style;
                //let iconName = "stop";                

                if (options.mztm)
                {
                    style = new ol.style.Style(
                    {
                        // image: new ol.style.Icon(
                        // {
                        //     size: [24, 24],
                        //     src: `${pis.settings.map.contentUrl}/mztm/${iconName}.png`
                        // })
                        image: new ol.style.Circle(
                            {
                                radius: 6,
                                fill: new ol.style.Fill(
                                {
                                    color: "#273370"
                                }),
                                stroke: new ol.style.Stroke(
                                {
                                    width: 2,
                                    color: "#fff"
                                })                         
                            })
                    })
                }
                else
                {
                    style = new ol.style.Style(
                    {
                        image: new ol.style.Circle(
                        {
                            radius: 12,
                            fill: new ol.style.Fill(
                            {
                                color: "#333"
                            }),
                            stroke: new ol.style.Stroke(
                            {
                                width: 1,
                                color: "#000"
                            })
                        }),
                        text: new ol.style.Text(
                        {
                            text: "\ue267",
                            font: "normal 10px 'Glyphicons Regular'",
                            textAlign: "center",
                            offsetY: 3,
                            fill: new ol.style.Fill(
                            {
                                color: "white" //"#5bea68"
                            })
                        })                                                
                    })
                }

                styles.push(style);
                              
                const platforms = feature.get("platforms");
                let text = feature.get("name");
                
                if (platforms.length > 1)
                {
                    text += " | " + platforms
                        .slice(0, 3)
                        .reduce((joined, platform) => joined + ", " + platform);

                    if (platforms.length > 3)
                    {
                        text += " ..."
                    }
                }               

                styles.push(new ol.style.Style(
                {
                    text: new ol.style.Text(
                    {
                        text: text,
                        font: "bold 11px 'Source Sans Pro'",
                        textAlign: "center",
                        //offsetX: -10,
                        offsetY: -25,
                        padding: [3, 4, 3, 4],
                        fill: new ol.style.Fill(
                        {
                            color: "#333" //"#5bea68"
                        }),
                        backgroundFill: new ol.style.Fill(
                        {
                            color: "#ffffffcc" //"#5bea68"
                        }),
                        // backgroundStroke: new ol.style.Stroke(
                        // {
                        //     width: 2,
                        //     color: "#000"//"#5bea68"
                        // })
                    })
                }));

                return styles;
            };
        };

        this._init = function()
        {
            /* If cluster is enabled, then clustered stops appear first.
               Then at defined zoom the cluster layer is disabled and the grouped stops appear.
               Then at defined zoom the grouped stops layer is disabled and stop platforms appear.
            */

            if (options.cluster)
            {
                const stopClusterSource = new ol.source.Cluster(
                {
                    distance: options.clusterDistance || 20,
                    source: new ol.source.Vector()
                });

                stopClusterSource.on("change", function(e)
                {
                    self.event.call("clusterchange", e);
                });

                const stopClusterLayer = new ol.layer.AnimatedCluster(
                {
                    name: "StopPlatforms",
                    source: stopClusterSource,
                    animationDuration: 200,
                    zIndex: 2,
                    style: self._styleGenerator.getStopPlatformStyle
                });

                if (options.minZoomStops)
                {
                    stopClusterLayer.setMaxZoom(options.minZoomStops);
                }

                self._stopClusterSource = stopClusterSource;
                self._stopClusterLayer = stopClusterLayer;
                self._map.addLayer(stopClusterLayer);
            }

            const stopPlatformSource = new ol.source.Vector(
            {
                features: self._stopPlatformFeatures
            });

            const stopPlatformLayer = new ol.layer.Vector(
            {
                name: "StopPlatforms",
                source: stopPlatformSource,
                zIndex: 2,
                style: self._styleGenerator.getStopPlatformStyle
            });

            self._stopPlatformSource = stopPlatformSource;
            self._stopPlatformLayer = stopPlatformLayer;
            self._map.addLayer(stopPlatformLayer);

            const stopSource = new ol.source.Vector(
            {
                features: self._stopFeatures
            });

            const stopLayer = new ol.layer.Vector(
            {
                name: "Stops",
                source: stopSource,
                zIndex: 2,
                style: self._styleGenerator.getStopStyle
            });

            if (options.minZoomStopPlatforms)
            {
                stopPlatformLayer.setMinZoom(options.minZoomStopPlatforms - 1);
                stopLayer.setMaxZoom(options.minZoomStopPlatforms - 1);
            }

            if (options.minZoomStops)
            {
                stopLayer.setMinZoom(options.minZoomStops);
            }

            self._stopSource = stopSource;
            self._stopLayer = stopLayer;
            self._map.addLayer(stopLayer);
        };

        this.setStops = function(stopPlatforms, stops)
        {
            self.clear();
            self._stopPlatforms = stopPlatforms;
            self._stops = stops;           

            for (let i = 0; i < stopPlatforms.length; i++)
            {
                const stop = stopPlatforms[i];
                const latitude = stop.lat * wertyz.gps.COORDINATES_MULTIPLICATOR;
                const longitude = stop.long * wertyz.gps.COORDINATES_MULTIPLICATOR;

                const feature = new ol.Feature(
                {
                    id: stop.id,
                    name: stop.name2,
                    platform: stop.platf,
                    latitude: latitude,
                    longitude: longitude,
                    transportType: pis.transportType.getForStop(stop.platf),
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                });

                self._stopPlatformFeatures.push(feature);
            }

            if (options.cluster)
            {
                self._stopClusterSource.getSource().addFeatures(self._stopPlatformFeatures.getArray());
            }

            stops.forEach((value, key) =>
            {
                // const circle = wertyz.gps.smallestEnclosingCircle.makeCircle(value.map(stop =>
                // ({
                //     x: stop.long,
                //     y: stop.lat
                // })));

                // const latitude = circle.y * wertyz.gps.COORDINATES_MULTIPLICATOR;
                // const longitude = circle.x * wertyz.gps.COORDINATES_MULTIPLICATOR;

                //TODO pouzit upravenu metodu wertyz.helper.comparlable                
                //const sortedByPlatform = value.sort((s1, s2) => parseInt(s1.platf) > parseInt(s2.platf) ? 1 : -1);
                const sortedByPlatform = value.sort(wertyz.helper.comparable("platf", { valueFunction: parseInt }));
                const latitude = sortedByPlatform[0].lat * wertyz.gps.COORDINATES_MULTIPLICATOR;
                const longitude = sortedByPlatform[0].long * wertyz.gps.COORDINATES_MULTIPLICATOR;
                const feature = new ol.Feature(
                {
                    name: key,
                    platforms: sortedByPlatform.map(stop => stop.platf),
                    latitude: latitude,
                    longitude: longitude,
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                });

                self._stopFeatures.push(feature);
            });

        };

        this.getMap = function()
        {
            return self._map;
        };

        this.getStopPlatformFeature = function(stopId)
        {
            let feature = self._stopPlatformFeatures.getArray().find(s => s.get("id") === stopId);

            return feature;
        };

        this.getStopFeature = function(stopName)
        {
            let feature = self._stopFeatures.getArray().find(s => s.get("name") === stopName);

            return feature;
        };

        this.getExtent = function()
        {
            return self._stopPlatformSource.getExtent();
        };

        this.getResolution = function(coords)
        {
            let view = self._map.getView();
            let resolution = view.getResolution();
            let projection = view.getProjection();

            if (!coords)
                coords = view.getCenter();

            let resolutionAtCoords = projection.getPointResolution(resolution, coords);

            return resolutionAtCoords;
        };

        this.hasStopFeature = (feature) =>
        {
            return self._stopPlatformFeatures.getArray().some(f => f === feature);
        }

        this.fit = function(fitOptions)
        {
            if (!self._stopPlatformFeatures.getLength())
            {
                self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
                self._map.getView().setZoom(2);

                return;
            }

            let extent = self.getExtent();
            self._map.getView().fit(extent, fitOptions);
        };

        this.fitStops = function(stopIds, fitOptions)
        {
            if (!stopIds.length)
                return;

            const features = stopIds.map(stopId => self.getStopPlatformFeature(stopId));
            const extent = wertyz.map.helper.getExtent(features);

            self._mapExtender.fit(extent, fitOptions);
        };

        this.zoomAnimate = function(options)
        {
            self._map.getView().animate(options);
        }

        this.show = function()
        {
            self._stopPlatformLayer.setVisible(true);
            self._stopLayer.setVisible(true);

            if (options.cluster)
            {
                self._stopClusterLayer.setVisible(true);
            }
        };

        this.hide = function()
        {
            self._stopPlatformLayer.setVisible(false);
            self._stopLayer.setVisible(false);

            if (options.cluster)
            {
                self._stopClusterLayer.setVisible(false);
            }
        };

        this.isShown = function()
        {
            return self._stopPlatformLayer.getVisible();
        }

        this.clear = function()
        {
            self._stopPlatformFeatures.clear();
            self._stopFeatures.clear();
            self._stopPlatforms = [];
            self._stops = new Map();

            if (options.cluster)
            {
                self._stopClusterSource.getSource().clear();
            }
        };

        this._init();
    };
};

pis.map.PlaceProcessor = class
{
    constructor(mapExtender, options)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);
        options = options || {};

        this._map = mapExtender.getMap();
        this._places = [];
        this._placesLayer = null;
        this._placeFeatures = new ol.Collection();

        this._styleGenerator = new function ()
        {
            this.getPointStyle = function(feature) {
                let styles = [];

                const zIndex = Math.floor(Math.random() * 1000) + 1;

                styles.push(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 13,
                            fill: new ol.style.Fill({
                                color: 'rgba(0, 0, 0, 0.2)'
                            })
                        }),
                        zIndex: zIndex
                    })
                )

                styles.push(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 11,
                            fill: new ol.style.Fill({
                                color: 'white'
                            })
                        }),
                        zIndex: zIndex
                    })
                )
                styles.push(
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 9,
                            fill: new ol.style.Fill({
                                color: feature.get('placeColor') !== undefined ? feature.get('placeColor') : '#1E90FF'
                            })
                        }),
                        zIndex: zIndex
                    })
                );
                styles.push(
                    new ol.style.Style({
                        text: new ol.style.Text({
                            font: 'bold 14px sans-serif',
                            text: 'P',
                            textAlign: 'center',
                            textBaseline: 'middle',
                            offsetY: 1,
                            offsetX: 1,
                            fill: new ol.style.Fill({
                                color: '#FFF'
                            })
                        }),
                        zIndex: zIndex
                    })
                )

                return styles;
            }
        }

        this.setPlaces = function(places)
        {
            this._places = places;
            this._placeFeatures.clear();

            for (let i = 0; i < places.length; i++)
            {
                let place = places[i];
                let point = places[i].points[0];

                let latitude = point.latitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                let longitude = point.longitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                
                const feature = new ol.Feature(
                {
                    id: place.id,
                    name: place.name,
                    latitude: latitude,
                    longitude: longitude,
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                });

                this._placeFeatures.push(feature);
            }
        };

        this.getExtent = function()
        {
            return this._placesLayer.getSource().getExtent();
        };

        this.fit = function(fitOptions)
        {
            if (!this._placeFeatures.getLength())
            {
                this._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
                this._map.getView().setZoom(2);

                return;
            }

            let extent = this.getExtent();
            this._map.getView().fit(extent, fitOptions);
        };

        this.show = function ()
        {
            this._placesLayer.setVisible(true);
        }

        this.hide = function ()
        {
            this._placesLayer.setVisible(false);
        }


        this._init = function ()
        {
            this._placesLayer = new ol.layer.Vector(
                {
                    name: "PlacesLayer",
                    source: new ol.source.Vector(
                    {
                        features: this._placeFeatures
                    }),
                    zIndex: 2,
                    style: this._styleGenerator.getPointStyle
                });

            this._map.addLayer(this._placesLayer);
        }

        this._init();
    }
}

pis.map.RouteProcessor = class
{
    constructor(mapExtender, options)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);
        options = options || {};

        const self = this;
        this._mapExtender = mapExtender;
        this._map = mapExtender.getMap();
        this._vehicles = [];
        this._stops = [];
        this._routes = [];
        this._stopLayer = null;
        this._routeLayer = null;
        this._vehicleFeatures = new ol.Collection();
        this._stopFeatures = new ol.Collection();
        this._routeFeatures = new ol.Collection();
        this._updateInProgress = false;

        this._styleGenerator = new function()
        {
            this.getPointStyle = function(feature)
            {
                let styles = [];
                let strokeWidth = 1;

                //LACO & PATO 2020-11-03

                // if (self.isFirstOrLastStop(feature))
                // {
                //     styles.push(new ol.style.Style(
                //     {
                //         image: new ol.style.Circle(
                //         {
                //             radius: 16,
                //             fill: new ol.style.Fill(
                //             {
                //                 color: feature === self.getFirstStop() ? "black" : "black"
                //             }),
                //             // stroke: new ol.style.Stroke(
                //             // {
                //             //     width: strokeWidth,
                //             //     color: "#000"
                //             // })
                //         }),
                //         text: new ol.style.Text(
                //         {
                //             text: "\ue267",
                //             font: "normal 14px 'Glyphicons Regular'",
                //             textAlign: "center",
                //             offsetY: 3,
                //             fill: new ol.style.Fill(
                //             {
                //                 color: feature === self.getFirstStop() ? "#5bea68" : "#ff4674"
                //             })
                //         })
                //     }));
                // }
                // else
                {
                    styles.push(new ol.style.Style(
                    {
                        image: new ol.style.Circle(
                        {
                            radius: 4,
                            fill: new ol.style.Fill(
                            {
                                color: feature.get("highlight") === true ? "yellow" /*black*/ : "yellow" //"#777777"
                            }),
                            stroke: new ol.style.Stroke(
                            {
                                width: strokeWidth,
                                color: "#000000"
                            })
                        }),
                        // text: new ol.style.Text(
                        // {
                        //     text: "?",
                        //     font: "bold 9px segoe ui",
                        //     textAlign: "center",
                        //     fill: new ol.style.Fill(
                        //     {
                        //         color: feature.get("highlight") === true ? "white" : "black"
                        //     }),
                        //     rotation: wertyz.gps.toRadians(feature.get("bearing") - 90)
                        // })
                    }));
                }

                return styles;
            };

            this.getRouteStyle = function(feature)
            {
                const highlight = feature.get("highlight");                
                const strokeColor = highlight
                    ? feature.get("highlightColor") || "#ff0000"
                    : "#000000";                         

                return new ol.style.Style(
                {
                    stroke: new ol.style.Stroke(
                    {
                        width: highlight ? 3 : 2,
                        color: strokeColor
                    }),
                    zIndex: highlight ? Infinity : 0
                });
            };

            this.getVehicleStyle = function(feature)
            {
                const styles = [];
                const transportType = feature.get("transportType");
                let color = "";
                let image;
                let offsetY;


                if (options.colorIcons)
                {
                    let iconName;
                    offsetY = -30;

                    switch (transportType)
                    {
                        case pis.TransportType.BUS:
                            iconName = "busColor";
                            break;
                        case pis.TransportType.TROLLEY:
                            iconName = "trolleyColor";
                            break;
                        case pis.TransportType.TRAM:
                            iconName = "tramColor";
                            break;
                        default:
                            iconName = "busColor";
                            break;
                    }

                    image = new ol.style.Icon(
                    {
                        size: [28, 28],
                        src: `${pis.settings.map.contentUrl}/${iconName}.png`
                    });
                }
                else
                {
                    offsetY = -57;

                    switch (transportType)
                    {
                        case pis.TransportType.BUS:
                            color = "yellow";
                            break;
                        case pis.TransportType.TROLLEY:
                            color = "green";
                            break;
                        case pis.TransportType.TRAM:
                            color = "red";
                            break;
                    }

                    image = new ol.style.Icon(
                    {
                        size: [36, 43],
                        //size: [25, 24],
                        anchor: [0.5, 1],
                        src: `${pis.settings.map.contentUrl}/vehicle36x43_${color}.png`
                        //src: pis.settings.map.contentUrl + "/vehicle.png"
                    });
                }

                if (options.colorIcons)
                {
                    const regularShape = pis.map.style.getAzimuthRegularShape(
                        feature.get("azimuth"),
                        20,
                        pis.transportType.getColor(transportType));

                    styles.push(new ol.style.Style(
                    {
                        image: regularShape
                    }));
                }

                styles.push(new ol.style.Style(
                {
                    image: image,
                    text: new ol.style.Text(
                    {                       
                        text: `\u27A4  ${ feature.get("nextStopName")} | ${ parseInt(feature.get("timeToNextStopInSec") / 60) } min`,
                        font: "bold 12px 'Source Sans Pro'",
                        textAlign: "center",
                        //offsetX: -10,
                        offsetY: offsetY,
                        padding: [4, 5, 4, 5],
                        fill: new ol.style.Fill(
                        {
                            color: "black" //"#5bea68"
                        }),
                        backgroundFill: new ol.style.Fill(
                        {
                            color: "#fff"
                        }),
                        // backgroundFill: new ol.style.Fill(
                        // {
                        //     color: color === "yellow"
                        //         ? "#edfa01"
                        //         : color === "green" ? "#19fa01" : "#fa1601" //"#edfa01" //"#5bea68"
                        // }),
                        // backgroundStroke: new ol.style.Stroke(
                        // {
                        //     width: 2,
                        //     color: "#000"//"#5bea68"
                        // })
                    })
                }));

                const delay = feature.get("delay");              
               
                if (delay && (delay <= -60 || delay >= 180))
                {//delay not between -1min and 3min
                    let delayColor;

                    if (delay <= -60)
                    { //delay less than -1min                       
                        delayColor = "red";
                    }
                    else
                    {
                        if (delay >= 180 && delay < 300)
                        { //delay more than 3min                    
                            delayColor = "olive";
                        }
                        else
                        { //delay more than 5min                   
                            delayColor = "blue";
                        }
                    }

                    styles.push(new ol.style.Style(
                    {
                        text: new ol.style.Text(
                        {
                            text: "\ue055",
                            font: "normal 12px 'Glyphicons Regular'",
                            textAlign: "center",
                            offsetX: -16,
                            offsetY: offsetY - 20,
                            padding: [2, 3, 2, 3],
                            fill: new ol.style.Fill(
                            {
                                color: "white" //"#5bea68"
                            }),
                            backgroundFill: new ol.style.Fill(
                            {
                                color: delayColor //"#5bea68"
                            })
                        })
                    }));
                    styles.push(new ol.style.Style(
                    {
                        text: new ol.style.Text(
                        {
                            text: `${parseInt(feature.get("delay") / 60)} min`,
                            font: "bold 12px 'Source Sans Pro'",
                            textAlign: "center",
                            offsetX: 10,
                            offsetY: offsetY - 20,
                            padding: [2, 3, 2, 3],
                            fill: new ol.style.Fill(
                            {
                                color: "white" //"#5bea68"
                            }),
                            backgroundFill: new ol.style.Fill(
                            {
                                color: delayColor //"#5bea68"
                            }),
                            // backgroundStroke: new ol.style.Stroke(
                            // {
                            //     width: 2,
                            //     color: "#edfa01"//"#5bea68"
                            // })
                        })
                    }));
                }

                return styles;
            };
        };

        this._init = function(routes)
        {
            let vehicleLayer = new ol.layer.Vector(
            {
                name: "Vehicles",
                source: new ol.source.Vector(
                {
                    features: self._vehicleFeatures
                }),
                zIndex: 3,
                style: self._styleGenerator.getVehicleStyle
            });
            self._vehicleLayer = vehicleLayer;

            let stopLayer = new ol.layer.Vector(
            {
                name: "StopPoints",
                source: new ol.source.Vector(
                {
                    features: self._stopFeatures
                }),
                zIndex: 2,
                style: self._styleGenerator.getPointStyle
            });
            self._stopLayer = stopLayer;

            let routeLayer = new ol.layer.VectorImage(
            {
                name: "Routes",
                source: new ol.source.Vector(
                {
                    features: self._routeFeatures
                }),
                zIndex: 1,
                style: self._styleGenerator.getRouteStyle
            });
            self._routeLayer = routeLayer;

            self._map.addLayer(routeLayer);
            self._map.addLayer(stopLayer);
            self._map.addLayer(vehicleLayer);
        };

        this._createVehicleFeature = (vehicle) =>
        {
            const latitude = vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR;
            const longitude = vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR;

            const feature = new ol.Feature(
            {
                id: vehicle.vid,
                transportType: pis.transportType.getForVehicle(vehicle.tv),
                azimuth: vehicle.az,
                routeNumber: vehicle.rn,
                nextStopName: vehicle.routeAttributes.nextStopName, //routeAttributes nejako inak
                timeToNextStopInSec: vehicle.routeAttributes.timeToNextStopInSec,
                delay: vehicle.delay                
            });

            if (self._routes.length && vehicle.rn && vehicle.spi)
            {
                const route = self._routes.find(route => route.name === vehicle.rn);
                const segment = pis.data.getRouteSegment(route, vehicle.spi);
                const snapPositionData = self._computeSnapPositionData(latitude, longitude, segment.points);

                if (snapPositionData.distance <= 20)
                {
                    feature.set("latitude", snapPositionData.latitude);
                    feature.set("longitude", snapPositionData.longitude);
                    feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat(
                        [snapPositionData.longitude, snapPositionData.latitude])));

                    return feature;
                }
            }

            feature.set("latitude", latitude);
            feature.set("longitude", longitude);
            feature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude])));

            return feature;
        };

        this._computeSnapPositionData = (lat, lng, segmentPoints, options) =>
        {
            const snapPosition = {
                latitude: lat,
                longitude: lng
            };

            let lat1 = segmentPoints[0].latitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
            let lng1 = segmentPoints[0].longitude * wertyz.gps.COORDINATES_MULTIPLICATOR;

            for (let i = 1; i < segmentPoints.length; i++)
            {
                const segmentPoint = segmentPoints[i];
                const lat2 = segmentPoint.latitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                const lng2 = segmentPoint.longitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                const distance = wertyz.gps.closestDistanceToPath(lat, lng, lat1, lng1, lat2, lng2);

                lat1 = lat2;
                lng1 = lng2;

                if (!snapPosition.distance || distance < snapPosition.distance)
                {
                    const closestPoint = wertyz.gps.closestPointOnPath(lat, lng, lat1, lng1, lat2, lng2);
                    snapPosition.latitude = closestPoint.latitude;
                    snapPosition.longitude = closestPoint.longitude;
                    snapPosition.distance = distance;
                    snapPosition.nextSegmentPointId = segmentPoint.segmentPointId;
                    snapPosition.nextSegmentPointOrder = segmentPoint.order;
                }
            }

            return snapPosition;
        };

        this._getPointsBetween = (route, segmentPointIdFrom, segmentPointIdTo) =>
        {
            const segmentFrom = pis.data.getRouteSegment(route, segmentPointIdFrom);
            const segmentTo = pis.data.getRouteSegment(route, segmentPointIdTo);
            const segmentPointFrom = segmentFrom.points.find(sp => sp.segmentPointId === segmentPointIdFrom);
            const segmentPointTo = segmentTo.points.find(sp => sp.segmentPointId === segmentPointIdTo);

            const segments = route.segments.filter(segment =>
                segment.segmentOrder >= segmentFrom.segmentOrder &&
                segment.segmentOrder <= segmentTo.segmentOrder);

            const points = segments.flatMap(segment =>
            {
                if (segment === segmentFrom)
                {
                    return segment.points.filter(sp => sp.order >= segmentPointFrom.order);
                }

                if (segment === segmentTo)
                {
                    return segment.points.filter(sp => sp.order <= segmentPointTo.order);
                }

                return segment.points;
            });

            console.log(segmentPointIdFrom, segmentPointIdTo, segments, points);
            return points;
        };

        this.updateVehicles = function(vehicles)
        {
            const compared = wertyz.helper.compareArraysByComparisonFunction(self._vehicles, vehicles, (vehicle1, vehicle2) =>
            {
                return vehicle1.vid === vehicle2.vid;
            });

            //console.log("Update start", compared, self._vehicleFeatures.getArray());

            if (!compared.join.length)
            {
                self.setVehicles(vehicles);
                return;
            }

            //Remove old vehicles
            compared.unique1.forEach(vehicle =>
            {
                const feature = self.getVehicleFeature(vehicle.vid);
                self._vehicleFeatures.remove(feature);
                //console.log("Removing", vehicle.vid, feature);
            });

            //Add new vehicles
            compared.unique2.forEach(vehicle =>
            {
                const feature = self._createVehicleFeature(vehicle);
                self._vehicleFeatures.push(feature);
                //console.log("Adding", vehicle.vid, feature);
            });

            //Update vehicles

            const startTime = (new Date()).getTime();
            const animTime = 300; //ms
            //const mapPoints = new Map();

            self._updateInProgress = true;
            requestAnimationFrame(animate);

            function animate()
            {
                if (!self._updateInProgress)
                    return;

                const elapsedTime = (new Date()).getTime() - startTime;
                const isLastFrame = elapsedTime >= animTime;

                compared.join.forEach((v, index) =>
                {
                    //v is old object
                    const vehicle = vehicles.find(veh => veh.vid === v.vid);
                    const feature = self.getVehicleFeature(v.vid);
                    const ratio = Math.min(1, elapsedTime / animTime);

                    let latitude = vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR;
                    let longitude = vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR;
                    let point;

                    if (self._routes.length && vehicle.rn && vehicle.spi)
                    {
                        const route = self._routes.find(route => route.name === vehicle.rn);
                        const segment = pis.data.getRouteSegment(route, vehicle.spi);
                        const snapPositionData = self._computeSnapPositionData(latitude, longitude, segment.points);

                        if (snapPositionData.distance <= 20)
                        {
                            // let points = mapPoints.get(vehicle.vid);

                            // if (!points)
                            // {
                            //     const oldLat = v.la * wertyz.gps.COORDINATES_MULTIPLICATOR;
                            //     const oldLng = v.lo * wertyz.gps.COORDINATES_MULTIPLICATOR;
                            //     const oldSegment =pis.data.getRouteSegment(route, v.spi);
                            //     const snapPositionDataOld = self._computeSnapPositionData(oldLat, oldLng, oldSegment.points);
                            //     points = self._getPointsBetween(route, snapPositionDataOld.nextSegmentPointId, vehicle.spi);
                            //     points.pop();
                            //     points.push({latitude: snapPositionData.latitude / wertyz.gps.COORDINATES_MULTIPLICATOR, longitude: snapPositionData.longitude / wertyz.gps.COORDINATES_MULTIPLICATOR});
                            //     mapPoints.set(vehicle.vid, points.map(point =>
                            //     ({
                            //         latitude: point.latitude * wertyz.gps.COORDINATES_MULTIPLICATOR,
                            //         longitude: point.longitude * wertyz.gps.COORDINATES_MULTIPLICATOR
                            //     })));
                            // }

                            latitude = snapPositionData.latitude;
                            longitude = snapPositionData.longitude;
                            //point = wertyz.gps.intermediatePointOnTrack(points, ratio);
                        }
                    }

                    if (!point)
                    {
                        point = wertyz.gps.intermediatePoint(
                            feature.get("latitude"),
                            feature.get("longitude"),
                            latitude,
                            longitude,
                            ratio);
                    }

                    const coordinates = ol.proj.fromLonLat([point.longitude, point.latitude]);
                    feature.getGeometry().setCoordinates(coordinates);
                });

                if (isLastFrame)
                {
                    self.setVehicles(vehicles);
                    self._updateInProgress = false;

                    return;
                }

                requestAnimationFrame(animate);
            };
        };

        this.setVehicles = function(vehicles)
        {
            self._vehicles = vehicles;
            self._vehicleFeatures.clear();

            for (let i = 0; i < vehicles.length; i++)
            {
                const vehicle = vehicles[i];
                const feature = self._createVehicleFeature(vehicle);
                self._vehicleFeatures.push(feature);
            }
        };

        this.setStops = function(stops)
        {
            self._stops = stops;
            self._stopFeatures.clear();

            for (let i = 0; i < stops.length; i++)
            {
                let stop = stops[i];
                let latitude = stop.lat * wertyz.gps.COORDINATES_MULTIPLICATOR;
                let longitude = stop.long * wertyz.gps.COORDINATES_MULTIPLICATOR;
                
                const feature = new ol.Feature(
                {
                    id: stop.id,
                    name: stop.name2,
                    platform: stop.platf,
                    latitude: latitude,
                    longitude: longitude,
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                });

                self._stopFeatures.push(feature);
            }
        };

        this.setRoutes = function(routes)
        {
            self._routes = routes;
            self._routeFeatures.clear();

            for (let i = 0; i < routes.length; i++)
            {
                let route = routes[i];
                let polygonArray = [];
                let feature;

                let routeFeature = new ol.Feature(
                {
                    routeId: route.id,
                    routeNumber: route.name,
                    routeName: route.name + "\r\n\r\n" + route.startName + " - " + route.endName,
                });

                for (let j = 0; j < route.segments.length; j++)
                {
                    let segment = route.segments[j];

                    for (let k = 0; k < segment.points.length; k++)
                    {
                        if (j < route.segments.length - 1 && k === segment.points.length - 1)
                            continue;

                        let point = segment.points[k];
                        let latitude = point.latitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                        let longitude = point.longitude * wertyz.gps.COORDINATES_MULTIPLICATOR;
                        let bearing;

                        if (k === 0 || k === segment.points.length - 1)
                        {
                            //bearing
                            if (feature)
                            {
                                bearing = wertyz.gps.bearing(feature.get("latitude"), feature.get("longitude"), latitude, longitude);
                                feature.set("bearing", bearing);
                            }

                            feature = new ol.Feature(
                            {
                                id: point.id,
                                routeId: route.id,
                                latitude: latitude,
                                longitude: longitude,
                                geometry: new ol.geom.Point(ol.proj.fromLonLat([longitude, latitude]))
                            });

                            if (k === 0)
                            {
                                feature.set("id", segment.startPlatformID);
                                feature.set("name", segment.startPlatformName);
                            }
                            else
                            {
                                feature.set("id", segment.endPlatformID);
                                feature.set("name", segment.endPlatformName);
                            }

                            self._stopFeatures.push(feature);
                        }

                        polygonArray.push(ol.proj.transform([longitude, latitude],
                            "EPSG:4326",
                            "EPSG:3857"));
                    }
                }

                //Route
                let lineString = new ol.geom.LineString(polygonArray);
                routeFeature.setGeometry(lineString);
                self._routeFeatures.push(routeFeature);
            }
        };

        this.getMap = function()
        {
            return self._map;
        };

        this.getStopFeature = function(stopId)
        {
            let stopFeature = self._stopFeatures.getArray().find(s => s.get("id") === stopId);

            return stopFeature;
        };

        this.getRouteFeature = function(routeId)
        {
            const routeFeature = self._routeFeatures.getArray().find(rf => rf.get("routeId") === routeId);

            return routeFeature;
        };

        this.getRouteFeatures = function()
        {
            return self._routeFeatures;
        };

        this.getRouteFeatureByRouteNumber = function(routeNumber)
        {
            const routeFeature = self._routeFeatures.getArray().find(rf => rf.get("routeNumber") === routeNumber);

            return routeFeature;
        };

        this.getVehicleFeature = function(vehicleId)
        {
            const vehicleFeature = self._vehicleFeatures.getArray().find(vf => vf.get("id") === vehicleId);

            return vehicleFeature;
        };

        this.getFirstStop = function()
        {
            return self._stopFeatures.item(0);
        };

        this.getLastStop = function()
        {
            let lastStopIndex = self._stopFeatures.getLength();

            return self._stopFeatures.item(lastStopIndex - 1);
        };

        this.isFirstOrLastStop = function(feature)
        {
            const isFirstOrLastStop = feature === self.getFirstStop() || feature === self.getLastStop();

            return isFirstOrLastStop;
        };

        this.getExtent = function()
        {
            let extent1 = self._vehicleLayer.getSource().getExtent();
            let extent2 = self._stopLayer.getSource().getExtent();
            let extent = ol.extent.extend(extent1, extent2);

            return extent;
        };

        this.getResolution = function(coords)
        {
            let view = self._map.getView();
            let resolution = view.getResolution();
            let projection = view.getProjection();

            if (!coords)
                coords = view.getCenter();

            let resolutionAtCoords = projection.getPointResolution(resolution, coords);

            return resolutionAtCoords;
        };

        this.hasStopFeature = (feature) =>
        {
            return self._stopFeatures.getArray().some(f => f === feature);
        }

        this.highlightRouteFeature =  (routeId, options) => 
        {
            self._routeFeatures.forEach((routeFeature) =>
            {
                routeFeature.set("highlight", false);
            });            

            if (options && options.color)
            {
                self.getRouteFeature(routeId).set("highlightColor", options.color); 
            }
           
            self.getRouteFeature(routeId).set("highlight", true);
           
        };

        this.clearRouteFeatureHighlight =  (routeId) => 
        {
            const routeFeature = self.getRouteFeature(routeId);

            if (!routeFeature)
                return;

            routeFeature.set("highlight", false);
        };

        this.fit = function(options)
        {
            if (!self._vehicleFeatures.getLength() && !self._stopFeatures.getLength())
            {
                self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
                self._map.getView().setZoom(2);

                return;
            }

            let extent = self.getExtent();
            self._map.getView().fit(extent, options);
        };

        this.zoomAnimate = function(options)
        {
            self._map.getView().animate(options);
        }

        this.show = function()
        {
            self._vehicleLayer.setVisible(true);
            self._stopLayer.setVisible(true);
            self._routeLayer.setVisible(true);
        };

        this.hide = function()
        {
            self._vehicleLayer.setVisible(false);
            self._stopLayer.setVisible(false);
            self._routeLayer.setVisible(false);
        };

        this.clear = function()
        {
            self._updateInProgress = false;
            self._vehicleFeatures.clear();
            self._stopFeatures.clear();
            self._routeFeatures.clear();
            self._vehicles = [];
            self._stops = [];
            self._routes = [];
        };

        this.isShown = function()
        {
            return self._stopLayer.getVisible();
        }

        this._init();
    };
};

pis.map.UserProcessor = class
{
    constructor(mapExtender, point)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

        const self = this;
        this._mapExtender = mapExtender;
        this._map = mapExtender.getMap();
        this._features = new ol.Collection();
        this._layer = null;

        this._init = function (points)
        {
            self._createFeatures(point);

            let layer = new ol.layer.Vector(
                {
                    name: "UserPosition",
                    source: new ol.source.Vector(
                        {
                            features: self._features
                        }),
                    zIndex: 9,
                    style: self._styleGenerator.getStyle
                });
            self._layer = layer;

            self._map.addLayer(layer);
        };

        this._styleGenerator = new function ()
        {
            this.getStyle = function (feature)
            {
                const styles = [];

                const innerCircle = new ol.style.Style(
                    {
                        image: new ol.style.Circle(
                            {
                                radius: 5,
                                fill: new ol.style.Fill(
                                    {
                                        color: "#4285F4"
                                    }),
                                stroke: new ol.style.Stroke(
                                    {
                                        width: 2,
                                        color: "#fff"
                                    })
                            })
                    });

                const outerCircle = new ol.style.Style(
                    {
                        image: new ol.style.Circle(
                            {
                                radius: 35,
                                fill: new ol.style.Fill(
                                    {
                                        color: "#4285F455"
                                    }),
                                stroke: new ol.style.Stroke(
                                    {
                                        width: 1,
                                        color: "#4285F4"
                                    })
                            })
                    });

                styles.push(outerCircle);
                styles.push(innerCircle);

                return styles;
            };
        };

        this._getFeatureOptions = function (point)
        {
            return {
                latitude: point.latitude,
                longitude: point.longitude,
                type: "userPosition",
                geometry: new ol.geom.Point(ol.proj.fromLonLat([point.longitude, point.latitude]))
            };
        };

        this._createFeatures = function (point)
        {
            let options = self._getFeatureOptions(point);
            let feature = new ol.Feature(options);

            self._features.push(feature);
        };

        this.getMap = function ()
        {
            return self._map;
        };

        this.fitMap = function (options)
        {
            let geometry = self._features.getArray()[0].getGeometry();

            self._map.getView().fit(geometry, options);
        };

        this.refresh = function (point)
        {
            self.clear();
            self._createFeatures(point);
        };

        this.clear = function ()
        {
            self._features.clear();
        };

        this._init(point);
    }
};

pis.map.Popup = class
{
    constructor(element, map, type)
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

        const $popup = $(element);
        const $header = $popup.find("." + type + "-popup__header");
        const $content = $popup.find("." + type + "-popup__content");
        const overlay = new ol.Overlay(
        {
            element: element,
            positioning: "bottom-center"
        });

        let referenceId;

        this._$ui = $popup;
        this._overlay = overlay;

        this.getContainer$ = () =>
        {
            return $popup;
        };

        this.getPosition = () =>
        {
            return overlay.getPosition();
        };

        this.getReferenceId = () =>
        {
            return referenceId;
        };

        this.setPosition = (position) =>
        {
            overlay.setPosition(position);
        };

        this.animatePosition = (position, options) =>
        {
            const startPosition = overlay.getPosition();

            if (!startPosition)
            {
                overlay.setPosition(position);
                return;
            }

            const startGpsCoordinates = ol.proj.toLonLat(startPosition);
            const endGpsCoordinates = ol.proj.toLonLat(position);
            const startTime = (new Date()).getTime();
            const duration = options && options.duration ? options.duration : 300; //ms

            requestAnimationFrame(animate);

            function animate()
            {
                const elapsedTime = (new Date()).getTime() - startTime;

                if (elapsedTime >= duration)
                {
                    overlay.setPosition(position);

                    return;
                }

                const ratio = elapsedTime / duration;
                const point = wertyz.gps.intermediatePoint(startGpsCoordinates[1],
                    startGpsCoordinates[0],
                    endGpsCoordinates[1],
                    endGpsCoordinates[0],
                    ratio);
                const coordinates = ol.proj.fromLonLat([point.longitude, point.latitude])
                overlay.setPosition(coordinates);

                requestAnimationFrame(animate);
            };
        };

        this.setReferenceId = (id) =>
        {
            referenceId = id;
        };

        this.setHeader = (html) =>
        {
            $header.html(html);
        };

        this.setContent = (html) =>
        {
            if (html)
            {
                $content.html(html);
                $content.show();
                return;
            }

            $content.hide();
        };

        this.getContentElement$ = () =>
        {
           return $content;
        };

        this.toggleClass = (className, state) =>
        {
            $popup.toggleClass(className, state);
        };

        this.hide = () =>
        {
            overlay.setPosition();

            if (this.event.hasRegistered("hide"))
            {
                this.event.call("hide");
            }
        };

        map.addOverlay(overlay);
        $popup.show();
    }
};

pis.map.style = {};

pis.map.style.getAzimuthRegularShape = (azimuth, displacementRadius, color) =>
{
    //TODO do globalnej fcie
    const azimuthInRad = wertyz.gps.toRadians(azimuth);
    const displacement = [
        displacementRadius * Math.sin(azimuthInRad), //x
        displacementRadius * Math.cos(azimuthInRad)
    ]; //y 

    const regularShape = new ol.style.RegularShape(
    {
        fill: new ol.style.Fill(
        {
            color: color
        }),
        // stroke: new ol.style.Stroke(
        // {
        //     width: 1,
        //     color: "#000000a0"
        // }),                      
        points: 3,
        radius: 7,
        angle: azimuthInRad,
        rotation: 0,
        displacement: displacement
    });

    return regularShape;
};

pis.map.style.getIconNameForVehicle = (transportType) => 
{
    let iconName;

    if (transportType === pis.TransportType.BUS)
    {
        iconName = "busColor";
    }
    else if (transportType === pis.TransportType.TROLLEY)
    {
        iconName = "trolleyColor";
    }
    else
    {
        iconName = "tramColor";
    }

    return iconName;
};

pis.map.style.getIconNameForStop = (transportType) => 
{
    let iconName = "stop";
    transportType = 3; //zatial jeden typ, nevieme zistit typ zastavky

    if (transportType & pis.TransportType.BUS)
    {
        iconName += "_bus";
    }

    if (transportType & pis.TransportType.TRAM)
    {
        iconName += "_tram";
    }

    if (transportType & pis.TransportType.TROLLEY)
    {
        iconName += "_trolley";
    }

    return iconName;
};

// #endregion
