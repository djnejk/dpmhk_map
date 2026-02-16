/// <reference path="../../js/wertyz.js" />
/// <reference path="waitMe.min.js" />

wertyz.map = {};

wertyz.map.settings = new function()
{
    this.maxFitZoom = 14;

	// necessary to set in hosting app
    this.contentUrl = "";

    this.vehicle = new function()
    {
        let self = this;

        //#region Show vehicles

        this._show = true;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion

        //#region Followed Obu

        this._followedObu = null;
        this.getFollowedObu = function()
        {
            return this._followedObu;
        };
        this.setFollowedObu = function(obu)
        {
            this.event.call("followedobu", obu);
            this._followedObu = obu;
        };

        //#endregion

        //#region Cluster distance

        this._clusterDistance = 25;
        this.getClusterDistance = function()
        {
            return this._clusterDistance;
        };
        this.setClusterDistance = function(distance)
        {
            if (isNaN(distance))
                return;

            this._clusterDistance = distance;
            this.event.call("clusterdistance", distance);
        };

        //#endregion                                             

        //#region Filter           

        this.filter = new function()
        {
            this.setFromLocalStorage = function()
            {
                let filter = {};

                JSON.parse(localStorage.getItem("profilvehicles")).forEach((obu, index) =>
                {
                    if (index === 0)
                        filter["obu"] = [];
                    filter["obu"].push(obu);
                });
                JSON.parse(localStorage.getItem("profildrivers")).forEach((driverNumber, index) =>
                {
                    if (index === 0)
                        filter["driverNumber"] = [];
                    filter["driverNumber"].push(driverNumber);
                });
                JSON.parse(localStorage.getItem("profillines")).forEach((lineRoute, index) =>
                {
                    if (index === 0)
                        filter["routeNumber"] = [];
                    filter["routeNumber"].push(lineRoute[1]);
                });
                JSON.parse(localStorage.getItem("profilgarages")).forEach((garageNumber, index) =>
                {
                    if (index === 0)
                        filter["garageNumber"] = [];
                    filter["garageNumber"].push(garageNumber);
                });
                JSON.parse(localStorage.getItem("profilstatusesorder")).forEach((orderColor, index) =>
                {
                    if (index === 0)
                        filter["orderColor"] = [];
                    filter["orderColor"].push(orderColor);
                });
                JSON.parse(localStorage.getItem("profilstatusestrip")).forEach((tripColor, index) =>
                {
                    if (index === 0)
                        filter["tripColor"] = [];
                    filter["tripColor"].push(tripColor);
                });
                JSON.parse(localStorage.getItem("profilstatusesvehicle")).forEach((stateColor, index) =>
                {
                    if (index === 0)
                        filter["stateColor"] = [];
                    filter["stateColor"].push(stateColor);
                });

                //StatusId
                JSON.parse(localStorage.getItem("profilstatusescommunication")).forEach((statusIdCommunication, index) =>
                {
                    if (index === 0)
                        filter["statusIdCommunication"] = [];
                    filter["statusIdCommunication"].push(statusIdCommunication);
                });
                // JSON.parse(localStorage.getItem("profilstatusescommunication24h")).forEach((statusIdCommunication24h, index) =>
                // {
                //    if (index === 0)
                //       filter["statusIdCommunication24h"] = [];
                //    filter["statusIdCommunication24h"].push(statusIdCommunication24h);
                // });
                // JSON.parse(localStorage.getItem("profilstatusescommunicationduty1h")).forEach((statusIdCommunicationDuty1h, index) =>
                // {
                //    if (index === 0)
                //       filter["statusIdCommunicationDuty1h"] = [];
                //    filter["statusIdCommunicationDuty1h"].push(statusIdCommunicationDuty1h);
                // });
                JSON.parse(localStorage.getItem("profilstatusesgarage")).forEach((statusIdGarage, index) =>
                {
                    if (index === 0)
                        filter["statusIdGarage"] = [];
                    filter["statusIdGarage"].push(statusIdGarage);
                });
                JSON.parse(localStorage.getItem("profilstatusesgpsvalidation")).forEach((statusIdGpsValidation, index) =>
                {
                    if (index === 0)
                        filter["statusIdGpsValidation"] = [];
                    filter["statusIdGpsValidation"].push(statusIdGpsValidation);
                });
                JSON.parse(localStorage.getItem("profilstatusesoccupacy")).forEach((statusIdOccupacy, index) =>
                {
                    if (index === 0)
                        filter["statusIdOccupacy"] = []
                    filter["statusIdOccupacy"].push(statusIdOccupacy);
                });
                JSON.parse(localStorage.getItem("profilstatusesobustate")).forEach((statusIdObuState, index) =>
                {
                    if (index === 0)
                        filter["statusIdObuState"] = [];
                    filter["statusIdObuState"].push(statusIdObuState);
                });
                JSON.parse(localStorage.getItem("profilstatusestriproute")).forEach((statusIdTripRoute, index) =>
                {
                    if (index === 0)
                        filter["statusIdTripRoute"] = [];
                    filter["statusIdTripRoute"].push(statusIdTripRoute);
                });

                self.filter.set(filter);
            };
        };

        //#endregion            

        this.animation = new function()
        {
            this._speed = 20;
            this.getSpeed = function()
            {
                return this._speed;
            };
            this.setSpeed = function(speed)
            {
                this._speed = speed;
                this.event.call("speed", speed);
            };

            this.start = function(options)
            {
                this.event.call("start", options);
            };
        };
    };

    this.alarm = new function()
    {
        let self = this;

        //#region Show alarms

        this._show = true;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion

        //#region Cluster distance

        this._clusterDistance = 25;
        this.getClusterDistance = function()
        {
            return this._clusterDistance;
        };
        this.setClusterDistance = function(distance)
        {
            if (isNaN(distance))
                return;

            this._clusterDistance = distance;
            this.event.call("clusterdistance", distance);
        };

        //#endregion           
    };

    this.garage = new function()
    {
        let self = this;

        //#region Show vehicles

        this._show = true;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion                                                                    
    };

    this.trip = new function()
    {
        let self = this;

        //#region Show trips

        this._show = true;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion

        //#region Cluster distance

        this._clusterDistance = 25;
        this.getClusterDistance = function()
        {
            return this._clusterDistance;
        };
        this.setClusterDistance = function(distance)
        {
            if (isNaN(distance))
                return;

            this._clusterDistance = distance;
            this.event.call("clusterdistance", distance);
        };

        //#endregion           

        //#region Filter           

        this.filter = new function()
        {
            this.setFromLocalStorage = function()
            {
                let filter = {};

                JSON.parse(localStorage.getItem("profillines")).forEach((lineRoute, index) =>
                {
                    if (index === 0)
                        filter["routeNumber"] = [];
                    filter["routeNumber"].push(lineRoute[1]);
                });

                JSON.parse(localStorage.getItem("profilstatusestrip")).forEach((stateColor, index) =>
                {
                    if (index === 0)
                        filter["stateColor"] = [];
                    filter["stateColor"].push(stateColor);
                });

                self.filter.set(filter);
            };
        };

        //#endregion          
    };

    this.route = new function()
    {
        let self = this;

        //#region Show routes

        this._show = true;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion

        //#region Show points on route

        this._showPoints = true;
        this.getShowPoints = function()
        {
            return this._showPoints;
        };
        this.setShowPoints = function(showPoints)
        {
            this._showPoints = showPoints;
            this.event.call("showpoints", showPoints);
        };

        //#endregion

        //#region Edit mode

        this._editMode = false;
        this.getEditMode = function()
        {
            return this._editMode;
        };
        this.setEditMode = function(editMode)
        {
            this._editMode = editMode;
            this.event.call("editmode", editMode);
        };

        //#endregion           

        //#region Filter           

        this.filter = new function()
        {
            this.setFromLocalStorage = function()
            {
                let filter = {};

                JSON.parse(localStorage.getItem("profilroutes")).forEach((route, index) =>
                {
                    if (index === 0)
                        filter["route"] = [];
                    filter["route"].push(route);
                });

                self.filter.set(filter);
            };
        };

        //#endregion   
    };

    this.point = new function()
    {
        //#region Show points

        this._show = false;
        this.getShow = function()
        {
            return this._show;
        };
        this.setShow = function(show)
        {
            this._show = show;
            this.event.call("show", show);
        };

        //#endregion        
    };

    this.common = new function()
    {
        //#region Connection

        this._connectionOpacity = 0.3;
        this.getConnectionOpacity = function()
        {
            return this._connectionOpacity;
        };
        this.setConnectionOpacity = function(opacity)
        {
            if (isNaN(opacity))
                return;

            this._connectionOpacity = opacity;
            this.event.call("connectionopacity", opacity);
        };

        //#endregion   
    };
}

wertyz.map.ajax =
{
	getVehiclesUrl: "",
	getAlarmsUrl: "",
	getRoutesUrl: "",
	getPointsUrl: "",
	getPointsParameters: "",
	getTripStatesUrl: "",
	getVehicleAnimationUrl: "",
	getInfoTableScreenshotUrl: "",
	getInfoTableMessageFormUrl: "",
	savePointsUrl: "",
	savePointListTypesUrl: "",
	saveSegmentsUrl: "",
	saveRichSegmentPointsUrl: "",
	resultState:
	{
		ERROR: 0,
		OK: 1
	}
};

wertyz.map.data =
{
	vehicles: null,
	alarms: null,
	points: null,
	routes: null,
	trips: null,
	tripStates: null
};

wertyz.map.interaction =
{
	SearchType:
	{
		VEHICLE: 0,
		POINT: 1,
		LINE: 2,
		COORDINATES: 3
	},

	MeasureProcessor: function (mapExtender)
	{
		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._layer = null;
		this._features = new ol.Collection();
		this._drawInteraction = null;
		this._isActive = true;

		this._init = function (routes)
		{
			let vectorSource = new ol.source.Vector(
				{
					features: self._features
				});

			let layer = new ol.layer.Vector({
				source: vectorSource,
				style: self._styleGenerator.getStyle
			});

			let drawInteraction = new ol.interaction.Draw(
				{
					source: vectorSource,
					type: "LineString",
					style: self._styleGenerator.getDrawStyle
				});

			self._layer = layer;
			self._drawInteraction = drawInteraction;
			self._map.addLayer(layer);
			self._map.addInteraction(drawInteraction);
		};

		this._styleGenerator = new function ()
		{
			this.getStyle = function (feature)
			{
				let distanceKm = self._computeLineStringLength(feature.getGeometry()) / 1000;

				let style = new ol.style.Style(
					{
						fill: new ol.style.Fill({
							color: 'rgba(255, 255, 255, 0.2)'
						}),
						stroke: new ol.style.Stroke({
							color: "rgba(255, 0, 0, 1.0)",
							width: 2
						}),
						image: new ol.style.Circle({
							radius: 7,
							fill: new ol.style.Fill({
								color: '#ffcc33'
							})
						}),
						text: new ol.style.Text(
							{
								font: "bold 14px sans-serif",
								offsetX: 40,
								offsetY: -10,
								text: distanceKm.toFixed(2) + " km"
							})
					});

				return style;
			},

				this.getDrawStyle = function (feature)
				{
					let style = new ol.style.Style(
						{
							fill: new ol.style.Fill({
								color: 'rgba(255, 255, 255, 0.2)'
							}),
							stroke: new ol.style.Stroke({
								color: "rgba(255, 0, 0, 0.5)",
								lineDash: [10, 10],
								width: 2
							}),
							image: new ol.style.RegularShape({
								fill: new ol.style.Fill({
									color: '#ffcc33'
								}),
								stroke: new ol.style.Stroke({
									color: '#000',
									width: 1
								}),
								points: 4,
								radius: 10,
								radius2: 0,
								angle: 0
							})
						});

					let geometry = feature.getGeometry();

					if (geometry.getType() === "LineString")
					{
						let distanceKm = self._computeLineStringLength(feature.getGeometry()) / 1000;

						style.setText(new ol.style.Text(
							{
								font: "bold 14px sans-serif",
								offsetX: 40,
								offsetY: -10,
								text: distanceKm.toFixed(2) + " km"
							}));
					}

					return style;
				}
		};

		this._clear = function ()
		{
			self._features.clear();
		};

		this._computeLineStringLength = function (lineString)
		{
			let coordinates = lineString.getCoordinates();
			let projection = self._map.getView().getProjection();
			let sphere = new ol.Sphere(wertyz.gps.R);
			let distance = 0;

			for (let i = 0; i < coordinates.length - 1; ++i)
			{
				let c1 = ol.proj.transform(coordinates[i], projection, 'EPSG:4326');
				let c2 = ol.proj.transform(coordinates[i + 1], projection, 'EPSG:4326');
				distance += sphere.haversineDistance(c1, c2);
			}

			return distance;
		};

		this.getActive = function ()
		{
			return self._drawInteraction.getActive();
		};

		this.setActive = function (value)
		{
			self._clear();
			self._drawInteraction.setActive(value);
		};

		this._init();
	}
};

wertyz.map.instant =
{
	IWrapper: function ()
	{
		this._mapExtender = null;
		this._processor = null;
		this._isShown = false;

		this._init = function (options)
		{
			let self = this;
			let mapExtender = new wertyz.map.extender.Extender(options.container,
				{
					zoomControl: options.zoomControl || false,
					hideControl: options.hideControl === false ? false : true, //default true
					fullScreenControl: options.fullScreenControl || false
				});
			this._mapExtender = mapExtender;


			mapExtender.event.on("hidemap", function ()
			{
				self.hideMap(
					{
						direction: options.direction,
						complete: options.hideMapComplete
					});
			});

			mapExtender.event.on("loading", function (action)
			{
				if (action === "show")
				{
					mapExtender.getContainer$().waitMe(
						{
							effect: "rotation", //progressBar, roundBounce, facebook, ios, rotation, win8, win8_linear                                      
							bg: "rgba(255, 255, 255, 0.7)",
							color: "black"
						});
				}
				else
				{
					mapExtender.getContainer$().waitMe("hide");
				}
			});
		};

		this.showMap = function (options)
		{
			this._isShown = true;
			this._mapExtender.getContainer$().animate({ [options.direction || "right"]: "0%" }, 300, options.complete);
		}

		this.hideMap = function (options)
		{
			this._isShown = false;
			this._mapExtender.getContainer$().animate({ [options.direction || "right"]: "-33.33%" }, 300, options.complete);
		};

		this.isShown = function ()
		{
			return this._isShown;
		};

		this.getProcessor = function ()
		{
			return this._processor;
		};
	}
}

wertyz.map.vehicle = new function ()
{
	this.state =
	{
		ColorMap: [/*Empty*/"", "White", "Green", "Red", "Orange"],

		ColorMapExtended: [/*Empty*/"", "White", "Green", "Red", "Orange"],

		getIconPath: function (stateColor, stateColorExtended)
		{
			let iconPath = "Vehicle/state/" + wertyz.map.vehicle.state.getColorLowerCase(stateColor);

			if (stateColorExtended)
				iconPath += wertyz.map.vehicle.state.ColorMapExtended[stateColorExtended];

			return iconPath;
		},

		getIconPathNew: function (stateProperties)
		{
			let iconName = "Vehicle/new/";

			if (stateProperties.obuState === 0)
			{//obu is turned OFF               
				if (stateProperties.isCommunicating === 0)
				{
					iconName += "stateOffNoComm";
				}
				else
				{
					iconName += "stateOff";
				}
			}
			else
			{//obu is turned ON or never has been turned ON
				if (stateProperties.isAlert)
				{//obu has alert
					iconName += "stateAlert";
				}
				if (stateProperties.isCommunicating === 0)
				{//obu is not communicating
					iconName += "stateNoComm";
				}
				else
				{//obu is communicating
					if (stateProperties.driverNumber)
					{//driver is logged ON
						if (stateProperties.order && stateProperties.line) //stateProperties.stateColor === 2 ???
						{//driver is on duty
							if (stateProperties.delay > 180) //stateProperties.orderColor === 3 ???
							{//delay on duty
								iconName += "stateDelay";
							}
							else if (stateProperties.deviationGps > 0)
							{//obu is off the planned track
								iconName += "stateOffTrack";
							}
							else
							{//everything OK on duty
								iconName += "stateDutyOK";
							}
						}
						else
						{//no duty
							iconName += "stateNoDuty";
						}
					}
					else 
					{//driver is logged OFF
						iconName += "stateNoDriver";
					}

				}
			}

			return iconName;
		},

		getColorLowerCase: function (stateColor)
		{
			return wertyz.map.vehicle.state.ColorMap[stateColor].toLowerCase();
		},

		getClass: function (stateColor)
		{
			if (!stateColor)
				return null;

			return "state" + stateColor;
		},

		computeStateColorCount: function (vehicles)
		{
			let computed =
			{
				total: [0, 0] //[turned ON, turned OFF or never turned ON]
				//    white: [0, 0],
				//    green: [0, 0],
				//    red: [0, 0],
				//    orange: [0, 0]
			}

			wertyz.map.vehicle.state.ColorMap.forEach((colorName) =>
			{
				if (!colorName)
					return;

				computed[colorName.toLowerCase()] = [0, 0];
			});

			vehicles.forEach((vehicle, index) =>
			{
				let color = wertyz.map.vehicle.state.getColorLowerCase(vehicle.stateColor);

				if (vehicle.obuState === 1)
				{
					computed[color][0]++;
					computed.total[0]++;
				}
				else
				{
					computed[color][1]++;
					computed.total[1]++;
				}
			});

			return computed;
		},
	};

	this.ol =
	{
		getStyle: function (feature, resolution)
		{
			let features = feature.get("features");
			feature = features[0];

			let size = features.length;
			let image;
			let font;
			let color;
			let fillColor = "#000";
			let backgroundFill;
			let backgroundStroke;
			let padding;
			let textOffsetX = -1;
			let textOffsetY = -37;
			let text = "";
			let iconName = "";
			//let iconSize = [18, 30];
			let iconSize = [22, 30];
			let iconAnchor = [0.5, 1.0];
			let deviationGps = feature.get("deviationGps");
			let isFollowed = feature.get("isFollowed");
			let obuState = null;
			let isCommunicating = null;

			let styles = [];
			let style;

			if (size === 1)
			{ //One feature

				let driverName = feature.get("driverName");
				let driverNumber = feature.get("driverNumber");
				let order = feature.get("order");
				let orderColor = feature.get("orderColor");
				let speed = feature.get("speed");
				let state = feature.get("state");
				let line = feature.get("line");
				let trip = feature.get("trip");
				let tripColor = feature.get("tripColor");
				let delay = feature.get("delay");
				let passenger = feature.get("passenger");
				let stateColor = feature.get("stateColor");
				let stateColorExtended = feature.get("stateColorExtended");
				let crossroadOn = feature.get("crossroadOn");
				let azimuthDegrees = feature.get("azimuth");
				let isCommunicating24h = feature.get("isCommunicating24h");
				let isCommunicatingAfterActualDutyEnd1h = feature.get("isCommunicatingAfterActualDutyEnd1h");

				obuState = feature.get("obuState");
				isCommunicating = feature.get("isCommunicating");

				//    iconName = wertyz.map.vehicle.state.getIconPathNew(
				//       {
				//             obuState: obuState,
				//             isCommunicating: isCommunicating,
				//             isAlert: false, //TODO
				//             driverNumber: driverNumber,
				//             order: order,
				//             line: line,
				//             delay: delay,
				//             deviationGps: deviationGps,
				//       });				

				if (isCommunicatingAfterActualDutyEnd1h === 0 || isCommunicating24h === 0)
					iconName = wertyz.map.vehicle.state.getIconPath(1, 0); //White icon
				else
					iconName = wertyz.map.vehicle.state.getIconPath(stateColor, stateColorExtended);

				if (iconName.endsWith("stateOffTrack"))
					iconSize = [22, 39];

				if (order && line && isCommunicating)
				{
					text = line;
					backgroundFill = new ol.style.Fill({
						//color: "rgba(0, 0, 0, 0.1)",
						color: "rgba(255, 255, 255, 0.8)",
					});
					backgroundStroke = new ol.style.Stroke(
						{
							color: "rgba(0, 0, 0, 1.0)",
							width: 0.1
						});
					padding = [0, 1, 0, 1];

					fillColor = wertyz.map.trip.ol.getFillColorForText(tripColor);
					font = wertyz.map.trip.ol.getFontForText(tripColor);

					if (wertyz.helper.isNumber(trip) && passenger)
					{
						let offset = !isNaN(azimuthDegrees) && azimuthDegrees >= 0 && azimuthDegrees <= 90
							? { x: 17, y: -16 }
							: { x: 13, y: -8 };

						styles.push(new ol.style.Style(
							{
								text: new ol.style.Text({
									offsetX: offset.x,
									offsetY: offset.y,
									text: "\ue563",
									font: "bold 12px \"Glyphicons Regular\"",
									fill: new ol.style.Fill({
										color: "black",
									})
								})
							}));
					}
				}

				if (!isNaN(azimuthDegrees))
				{
					styles.push(new ol.style.Style(
						{
							image: new ol.style.Icon(
								{
									size: [10, 14],
									anchor: [0.5, 1],
									rotation: azimuthDegrees * Math.PI / 180,
									opacity: 0.4,
									src: wertyz.map.settings.contentUrl + "/arrowAzimuth.png"
								})
						}));
				}

				if (crossroadOn)
				{
					styles.push(new ol.style.Style(
						{
							image: new ol.style.Icon(
								{
									size: [13, 13],
									anchor: [-0.3, 2.2],
									src: wertyz.map.settings.contentUrl + "/trafficLightGreen.png"
								})
						}));
				}

				image = new ol.style.Icon(
					{
						size: iconSize,
						anchor: iconAnchor,
						src: wertyz.map.settings.contentUrl + "/" + iconName + ".png"
					});
			}
			else
			{ //Cluster

				let radius = Math.max(/*min*/12, Math.min(size * 0.3, /*max*/18));

				if (!isFollowed && wertyz.map.settings.vehicle.getFollowedObu())
				{ //If first feature in cluster is not followed and followed obu exists, then search cluster

					for (let i = 1; i < features.length; i++)
					{
						if (features[i].get("isFollowed"))
						{
							isFollowed = true;
							break;
						}
					}
				}

				if (!deviationGps)
				{
					for (let i = 1; i < features.length; i++)
					{
						if (features[i].get("deviationGps") > 0)
						{
							deviationGps = true;
							break;
						}
					}
				}

				font = "bold 11px sans-serif";
				color = "0, 0, 0";
				iconSize = [28, 28];
				text = size.toString();
				fillColor = "#fff";
				textOffsetX = 0;
				textOffsetY = 0;
				let strokeColor = deviationGps
					? "rgba(255, 0, 0, 0.45)"
					: "rgba(0, 0, 0, 0.45)";
				let strokeWidth = deviationGps
					? 3
					: 2;


				image = new ol.style.Circle(
					{
						fill: new ol.style.Fill({ color: "rgba(108, 108, 108, 0.65)" }),
						stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth }),
						radius: radius
					});
			}

			style = new ol.style.Style(
				{
					image: image
				})

			if (text)
			{
				let textStyle = new ol.style.Text(
					{
						font: font,
						text: text,
						fill: new ol.style.Fill(
							{
								color: fillColor
							}),
						offsetX: textOffsetX,
						offsetY: textOffsetY
					});

				if (backgroundFill)
					textStyle.setBackgroundFill(backgroundFill);
				if (backgroundStroke)
					textStyle.setBackgroundStroke(backgroundStroke);
				if (padding)
					textStyle.setPadding(padding);

				style.setText(textStyle);
			}

			styles.unshift(style);

			if (isCommunicating === 0)
			{
				styles.unshift(new ol.style.Style(
					{
						image: new ol.style.Icon(
							{
								size: [15, 10],
								anchor: [0.5, 0],
								src: wertyz.map.settings.contentUrl + "/noComRed.png"
							})
					}));
			}

			if (isFollowed)
			{
				style = new ol.style.Style(
					{
						image: new ol.style.Circle(
							{
								radius: size === 1 ? 20 : 26,
								fill: new ol.style.Fill(
									{
										color: "rgba(255, 0, 0, 0.1)",
									}),
								stroke: new ol.style.Stroke(
									{
										color: "rgba(255, 0, 0, 1.0)",
										width: 2
									}),
								//anchor: [22.5, 22.5],
							})
					});
				styles.unshift(style);
			}

			if (size === 1 && deviationGps > 0)
			{
				style = new ol.style.Style(
					{
						image: new ol.style.RegularShape(
							{
								points: 4,
								radius: size === 1 ? 10 : 20,
								radius2: 0,
								angle: Math.PI / 4, //size === 1 ? (Math.PI / 4) : 0,
								stroke: new ol.style.Stroke(
									{
										color: "rgba(255, 0, 0, 1.0)",
										width: 3
									})
							})
					});
				styles.unshift(style);
			}

			return styles;
		}
	};

	this.instant = new function ()
	{
		wertyz.map.instant.IWrapper.call(this);
		//wertyz.helper.assignFunctionToObject(this, wertyz.map.instant.IWrapper);

		let self = this;
		this._popupExtender = null;
		this._animContainer = null;
		this._timeout = null;
		this._isRequest = false;

		this.show = function (parameters, options)
		{
			if (self._isRequest)
				return true;

			if (self._timeout)
				clearTimeout(self._timeout);

			this._isRequest = true;

			if (!self._processor)
			{
				self._init(options); //IInstantWrapper._init
				self._animContainer = options.animContainer || options.container;
				self._processor = new wertyz.map.vehicle.Processor(self._mapExtender);
				self._popupExtender = new wertyz.map.popup.Extender(self._mapExtender,
					{
						vehicle:
						{
							showFollowButton: false
						}
					});
				self._popupExtender.vehicle.event.on("animate", function (obu)
				{
					wertyz.map.vehicle.animation.instant.start(
						{
							obu: obu,
							useDefault: true
						},
						{
							container: self._animContainer
						});
				});
			}

			self.showMap();
			self._mapExtender.loader("show");

			let done = function (data)
			{
				let vehicles = JSON.parse(data.data);

				if (vehicles && vehicles.length)
				{
					self._processor.refresh(vehicles);

					if (self._isRequest)
					{
						if (vehicles.length === 1)
							self._popupExtender.show(self._processor.getFeatures()[0]);
						self._processor.fitMap();
					}
					else if (self._popupExtender.isShowed())
					{
						let obu = self._popupExtender.getFeature().get("obu");
						let feature = self._processor.getVisibleFeature(obu);
						if (feature)
							//iba visible feature, prekontrolovať aj inde
							self._popupExtender.update(feature);
						else
							self._popupExtender.hide();
					}
				}

				if (options.refresh)
				{
					self._timeout = setTimeout(function ()
					{
						self._processor.load(parameters,
							{
								done: done,
								always: always
							});
					}, options.refresh);
				}
			};

			let always = function ()
			{
				self._isRequest = false;
				self._mapExtender.loader("hide");
			}

			self._processor.load(parameters,
				{
					done: done,
					always: always
				});
		};

		this.add = function (parameters, options)
		{
			if (self._isRequest)
				return;
			if (self._timeout)
				clearTimeout(self._timeout);
			self._isRequest = true;

			if (!self._processor)
				self._init(options);

			let mapExtender = self._processor.getMapExtender();

			if (!mapExtender.isShown)
			{
				mapExtender.getContainer$().animate({ [options.direction || "right"]: "0%" }, 300);
				mapExtender.isShown = true;
			}

			mapExtender.loader("show");

			let done = function (data)
			{
				let vehicles = JSON.parse(data.data);

				if (vehicles && vehicles.length)
				{
					self._processor.add(vehicles);

					if (self._isRequest)
					{
						if (vehicles.length === 1)
							self._popupExtender.show(self._processor.getFeatures()[0]);
						self._processor.fitMap();
					}
					else if (self._popupExtender.isShowed())
					{
						let obu = self._popupExtender.getFeature().get("obu");
						let feature = self._processor.getVisibleFeature(obu);
						if (feature)
							//iba visible feature, prekontrolovať aj inde
							self._popupExtender.vehicle.update(feature);
						else
							self._popupExtender.hide();
					}
				}

				if (options.refresh)
				{
					self._timeout = setTimeout(function ()
					{
						self._processor.load(parameters,
							{
								done: done,
								always: always
							});
					}, options.refresh);
				}
			};

			let always = function ()
			{
				self._isRequest = false;
				mapExtender.loader("hide");
			}

			self._processor.load(parameters,
				{
					done: done,
					always: always
				});
		};
	};

	this.animation =
	{
		instant: new function ()
		{
			wertyz.map.instant.IWrapper.call(this);

			let self = this;

			this.start = function (parameters, options)
			{
				if (!self._processor)
				{
					self._init(//IWrapper._init
						{
							container: options.container,
							followControl: true,
							hideMapComplete: function () 
							{
								self._processor.pause();
								self._processor.hideMap();
							}
						});

					let $container = $("#" + options.container);
					let $control = options.control
						? $("#" + options.control)
						: $container.find("div.animcontrol");

					self._processor = new wertyz.map.vehicle.animation.Processor(self._mapExtender, parameters.obu,
						{
							control: $control.get(0),
							followOnEachFrame: true,
							speed: options.speed || wertyz.map.settings.vehicle.animation.getSpeed()
						});

					self._mapExtender.organizeLayers();
					self._mapExtender.event.on("followmap", function ()
					{
						if (!self._processor)
							return;

						self._processor._followOnEachFrame = !self._processor._followOnEachFrame;

						if (self._processor._followOnEachFrame)
							self._processor.follow();
					});

					if ($control.length)
					{
						//Hack
						let opacity = $control.css("opacity");
						let display = $control.css("display");

						$control.css("opacity", "0.0");
						$control.css("display", "block");
						$control.find("div.slider").slider(
							{
								range: "min",
								min: 0,
								max: 10000,
								create: function ()
								{
									//Hack back     
									$control.css("display", display);
									$control.css("opacity", opacity);
								}
							});
					}
				}
				else
				{
					self._processor.setObu(parameters.obu);
				}

				let $container = self._mapExtender.getContainer$();
				let $selectedTimeButton = $container.find("button.timeselect.selected");

				if (parameters.useDefault || (!parameters.startAnimation && !parameters.endAnimation))
				{
					parameters.time = $selectedTimeButton.attr("data-time");
				}
				if (parameters.useDefault || !parameters.animationSpeed)
				{
					parameters.animationSpeed = wertyz.map.settings.vehicle.animation.getSpeed().toString();
				}

				if (!self._isShown)
				{
					self.showMap(
						{
							direction: options.direction,
							complete: self._processor.load(parameters, { done: options.done })
						});
				}
				else
				{
					if (self._processor && self._processor.isActive())
						self._processor.pause();
					self._processor.load(parameters, { done: options.done });
				}
			};
		},

		Processor: function (mapExtender, obu, options)
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			let self = this;
			this._mapExtender = mapExtender;
			this._map = mapExtender.getMap();
			this._popupExtender = null;
			this._routeProcessor = null;
			this._routeAnimProcessor = null;
			this._control = options.control || null;
			this._obu = obu;
			this._vehicleLayer = null;
			this._realityRouteLayer = null;
			this._realityValues = [];
			this._planRoutes = [];
			this._dateStart = null;
			this._lastIndex = -1;
			this._counterMilliseconds = 0;
			this._speed = options.speed || 20;
			this._frameRequest = null;
			this._vehicleFeatures = new ol.Collection();
			this._realityRouteFeatures = new ol.Collection();
			this._activePlanRouteFeature = null;
			this._followOnEachFrame = options.followOnEachFrame || false;

			this._axGet = function (parameters, options)
			{
				$.ajax(
					{
						type: "POST",
						url: wertyz.map.ajax.getVehicleAnimationUrl,
						data: parameters
					})
					.done(function (data, textStatus, jqXhr)
					{
						if (options.done)
							options.done(data);
					})
					.fail(function (jqXhr, textStatus, error)
					{
						console.log("Animation: Request failed. " + error);
					})
					.always(function ()
					{
						if (options.always)
							options.always();
					});
			};

			this._init = function ()
			{
				let vehicleLayer = new ol.layer.Vector(
					{
						name: "Vehicles",
						source: new ol.source.Vector(
							{
								features: self._vehicleFeatures
							}),
						style: self._styleGenerator.getVehicleStyle
					});

				let realityRouteLayer = new ol.layer.Vector(
					{
						name: "RealityRoutes",
						source: new ol.source.Vector(
							{
								features: self._realityRouteFeatures
							}),
						style: self._styleGenerator.getRealityRouteStyle
					});

				let popupExtender = new wertyz.map.popup.Extender(self._mapExtender,
					{
						vehicle:
						{
							showFollowButton: false,
							showAnimButton: false
						}
					});

				self._vehicleLayer = vehicleLayer;
				self._realityRouteLayer = realityRouteLayer;
				self._popupExtender = popupExtender;
				self._map.addLayer(vehicleLayer);
				self._map.addLayer(realityRouteLayer);

				self._routeProcessor = new wertyz.map.route.Processor(self._mapExtender, self._planRoutes,
					{
						editMode: false
					});

				if (self._control)
					self._bindControl();
			};

			this._bindControl = function ()
			{
				let $control = $(self._control);
				let $slider = $control.find("div.slider");
				let $toggle = $control.find("span.toggle");
				let isActive = false;

				$slider.on("slidestart", function (event, ui)
				{
					isActive = self.isActive();
				});

				$slider.on("slidestop", function (event, ui)
				{
					if (isActive)
						self.play();
				});

				$slider.on("slide", function (event, ui)
				{
					if (!self.hasRealData())
						return;

					self.rewind(ui.value / 10000);
				});

				$control.find("span.toggle").click(function ()
				{
					if (!self.hasRealData())
						return;

					self.toggle();
				});

				$control.find("span.reset").click(function ()
				{
					self.reset();
				});

				$control.find("button.timeselect").click(function ()
				{
					let $button = $(this);
					let time = $button.attr("data-time");

					$button.addClass("selected");
					$button.siblings("button.timeselect").each(function ()
					{
						$(this).removeClass("selected");
					});

					if (self.isActive())
						self.pause();

					self.load(
						{
							obu: self.getObu(),
							time: time,
							useDefault: true
						});
				});

				self.event.on("progress", function (ratio, date)
				{
					$slider.slider("value", parseInt(ratio * 10000));
					$control.find("span.time").text(date.toLocaleString());
				});

				self.event.on("change", function ()
				{
					if (self.isActive())
					{
						$toggle.removeClass("glyphicon-play");
						$toggle.addClass("glyphicon-pause");
					}
					else
					{
						$toggle.removeClass("glyphicon-pause");
						$toggle.addClass("glyphicon-play");
					}
				});
			};

			this._processRealityValues = function ()
			{
				if (!self._realityValues.length)
					return;

				let firstValue = self._realityValues[0];

				for (let i = 0; i < self._realityValues.length; i++)
				{
					let value = self._realityValues[i];

					self._realityValues[i] = new wertyz.map.vehicle.animation.Value(value);

					if (i === 0)
						continue;

					value = self._realityValues[i];
					let lastValue = self._realityValues[i - 1];

					value.obu = typeof value.obu !== "undefined" ? value.obu : lastValue.obu;
					value.vin = typeof value.vin !== "undefined" ? value.vin : lastValue.vin;
					value.licence = typeof value.licence !== "undefined" ? value.licence : lastValue.licence;
					value.driverName = typeof value.driverName !== "undefined" ? value.driverName : lastValue.driverName;
					value.order = typeof value.order !== "undefined" ? value.order : lastValue.order;
					value.line = typeof value.line !== "undefined" ? value.line : lastValue.line;
					value.trip = typeof value.trip !== "undefined" ? value.trip : lastValue.trip;
					value.delay = typeof value.delay !== "undefined" ? value.delay : lastValue.delay;
					value.deviation = typeof value.deviation !== "undefined" ? value.deviation : lastValue.deviation;
					//value.speed = typeof value.speed !== "undefined" ? value.speed : lastValue.speed;
					value.latitude = typeof value.latitude !== "undefined" ? value.latitude : lastValue.latitude;
					value.longitude = typeof value.longitude !== "undefined" ? value.longitude : lastValue.longitude;
					value.routeNumber = typeof value.routeNumber !== "undefined"
						? value.routeNumber
						: lastValue.routeNumber;

					let distance = wertyz.gps.haversineDistance(value.latitude, value.longitude, lastValue.latitude, lastValue.longitude);
					let time = (value.time - lastValue.time) / 1000;
					lastValue.speed = distance / time * 3.6;
				}
			};

			this._createRealityFeatures = function ()
			{
				self._vehicleFeatures.clear();
				self._realityRouteFeatures.clear();

				let feature = new ol.Feature(
					{
						obu: self._obu,
						type: "vehicle.animation",
						geometry: new ol.geom.Point(ol.proj.fromLonLat([
							self._realityValues[0].longitude,
							self._realityValues[0].latitude
						]))
					});
				feature.setProperties(self._realityValues[0]);

				let polygonArray = [];
				self._realityValues.forEach(function (value)
				{
					polygonArray.push(ol.proj.fromLonLat([value.longitude, value.latitude]));
				});
				let lineString = new ol.geom.LineString(polygonArray);
				let routeFeature = new ol.Feature({
					geometry: lineString,
					routeName: wertyz.map.getLocale("Real track of obu") + " " + self._obu,
					//visible: false,                 
					type: "route",
					subtype: "reality"
				});

				self._vehicleFeatures.push(feature);
				self._realityRouteFeatures.push(routeFeature);
			};

			this._createPlanFeatures = function ()
			{
				self._routeProcessor.refresh(self._planRoutes);
				self._routeProcessor.getRouteFeatures().getArray().forEach(function (routeFeature)
				{
					routeFeature.set("visible", false);
					routeFeature.get("pointFeatures").forEach(function (pointFeature)
					{
						pointFeature.set("visible", false);
					});
				});

				//if (!self._routeAnimProcessor)
				//   self._routeAnimProcessor = new wertyz.map.trip.animation.Processor(self._mapExtender, self._planRoutes);
				//else
				//   self._routeAnimProcessor.refresh(self._planRoutes);
				//self._routeAnimProcessor.start();               
			};

			this._clearCounters = function ()
			{
				self._counterMilliseconds = 0;
				self._lastIndex = -1;
			};

			this._frame = function (frame)
			{
				let index = self._lastIndex;
				let diffMilliseconds = frame
					? (new Date()) - self._dateStart
					: self._counterMilliseconds;
				let i;

				for (i = self._lastIndex + 1; i < self._realityValues.length; i++)
				{
					if (self._realityValues[i].time / self._speed <= diffMilliseconds)
						index = i;
					else
						break;
				}

				let value = self._realityValues[index];
				let feature = self._vehicleFeatures.getArray()[0];
				let newPosition;

				if (index > self._lastIndex)
				{ //Set new value

					//Vehicle               
					newPosition = ol.proj.fromLonLat([value.longitude, value.latitude]);
					feature.getGeometry().setCoordinates(newPosition);
					feature.setProperties(value);
					if (self._popupExtender.isShowed())
						self._popupExtender.update(feature);
				}
				else if (index < self._realityValues.length - 1)
				{ //Compute and set only position

					let nextValue = self._realityValues[index + 1];
					let ratio = (diffMilliseconds - (value.time / self._speed)) /
						((nextValue.time - value.time) / self._speed);
					let point = wertyz.gps.intermediatePoint(
						value.latitude,
						value.longitude,
						nextValue.latitude,
						nextValue.longitude,
						ratio);

					newPosition = ol.proj.fromLonLat([point.longitude, point.latitude]);
					feature.getGeometry().setCoordinates(newPosition);
					feature.set("latitude", wertyz.helper.toFixedFloat(point.latitude, 5));
					feature.set("longitude", wertyz.helper.toFixedFloat(point.longitude, 5));
					if (self._popupExtender.isShowed())
						self._popupExtender.update(feature);
				}

				//#region routes

				if (value.routeNumber && value.routeNumber !== "no route")
				{
					if (self._activePlanRouteFeature && self._activePlanRouteFeature.get("routeNumber") !== value.routeNumber)
					{
						self._activePlanRouteFeature.set("visible", false);
						self._activePlanRouteFeature.get("pointFeatures").forEach(function (pointFeature)
						{
							pointFeature.set("visible", false);
						});
					}

					let routeFeature = self._routeProcessor.getRouteFeatures().getArray().find(function (feature)
					{
						return feature.get("routeNumber") === value.routeNumber;
					});

					if (routeFeature)
					{
						self._activePlanRouteFeature = routeFeature;
						self._activePlanRouteFeature.set("visible", true);
						self._activePlanRouteFeature.get("pointFeatures").forEach(function (pointFeature)
						{
							pointFeature.set("visible", true);
						});
					}
				}
				else if (self._activePlanRouteFeature)
				{
					self._activePlanRouteFeature.set("visible", false);
					self._activePlanRouteFeature.get("pointFeatures").forEach(function (pointFeature)
					{
						pointFeature.set("visible", false);
					});
				}

				//#endregion

				if (self._followOnEachFrame)
					self.follow();

				self._lastIndex = index;
				self._counterMilliseconds = diffMilliseconds;

				if (self.event.hasRegistered("progress"))
				{
					let realTime = self._counterMilliseconds * self._speed;
					let ratioTime = realTime / self._realityValues[self._realityValues.length - 1].time;
					let date = new Date(self._realityValues[0].date.getTime() + realTime);
					self.event.call("progress", ratioTime, date);
				}

				if (frame && index < self._realityValues.length - 1)
					self._frameRequest = requestAnimationFrame(self._frame);
				else
					self.pause();
			};

			this._cancelFrame = function ()
			{
				cancelAnimationFrame(self._frameRequest);
				self._frameRequest = null;
			};

			this._recompute = function ()
			{
				if (self._lastIndex === -1)
					return;

				let currentDate = new Date();
				self._dateStart = new Date(currentDate.getTime() - self._counterMilliseconds);
			};

			this._recomputeBySpeed = function (speed)
			{
				if (self._lastIndex === -1)
					return;

				let speedChangeRatio = speed / self._speed;
				self._counterMilliseconds /= speedChangeRatio;
			};

			this._styleGenerator = new function ()
			{
				this.getVehicleStyle = function (feature)
				{
					let visible = feature.get("visible");
					if (visible === false)
						return null;

					let styles = [
						new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [36, 43],
										anchor: [0.5, 1.0],
										src: wertyz.map.settings.contentUrl + "/Vehicle/vehicle36x43.png"
									})
							})
					];

					return styles;
				};

				this.getRealityRouteStyle = function (feature)
				{
					let visible = feature.get("visible");
					if (visible === false)
						return null;

					let style = new ol.style.Style(
						{
							stroke: new ol.style.Stroke({
								width: 4,
								color: "rgba(253, 39, 39, 0.6)"
							})
						});

					return style;
				};
			};

			this.load = function (parameters, options)
			{
				self._mapExtender.loader("show");

				let done = function (data)
				{
					if (!data || !data.data)
					{
						console.log("Animation: There are no data in the reponse.");
						return;
					}

					let realityValues = JSON.parse(data.data);
					if (!realityValues || !realityValues.length)
					{
						console.log("Animation: There are no values in the response data. " + data);
						return;
					}

					let planRoutes = data.routes && data.routes.length ? JSON.parse(data.routes) : [];

					self._clearCounters();
					self.refresh(realityValues, planRoutes);
					self.showMap();
					self.play();
					self.fitMap();

					if (options && options.done)
						options.done.call(self, data);
				};

				let always = function ()
				{
					self._mapExtender.loader("hide");
				}

				self._axGet(parameters, { done: done, always: always });
			};

			this.play = function ()
			{
				if (self._lastIndex === -1)
					self._dateStart = new Date();
				else
					self._recompute();

				self._frame(true);
				self.event.call("change");
			};

			this.pause = function ()
			{
				self._cancelFrame();
				self.event.call("change");
			};

			this.toggle = function ()
			{
				if (self._frameRequest === null)
					self.play();
				else
					self.pause();
			};

			this.rewind = function (ratio)
			{
				if (self.isActive())
					self.pause();

				let rewindTime = parseInt(self._realityValues[self._realityValues.length - 1].time * ratio);
				let index = self._lastIndex;

				for (let i = self._realityValues.length - 1; i >= 0; i--)
				{
					if (self._realityValues[i].time <= rewindTime)
					{
						//Force update of new value
						//if (i > self._lastIndex)
						//self._lastIndex = i - 1;
						//else
						self._lastIndex = i;
						break;
					}
				}

				if (self._lastIndex !== index)
				{
					let feature = self._vehicleFeatures.getArray()[0];
					let value = self._realityValues[self._lastIndex];
					feature.setProperties(value);
					//self._popupExtender.update();
					//self._setLabel(self._realityValues[self._lastIndex]);
				}

				self._counterMilliseconds = parseInt(rewindTime / self._speed);
				self._frame();
			};

			this.reset = function ()
			{
				if (self.isActive())
					self.pause();

				self._counterMilliseconds = 0;
				if (self._lastIndex > -1)
				{
					self._lastIndex = -1;
					self._frame();
				}
			};

			this.refresh = function (realityValues, planRoutes)
			{
				self._realityValues = realityValues;
				self._planRoutes = planRoutes;
				self._processRealityValues();
				self._createRealityFeatures();
				self._createPlanFeatures();
			};

			this.setSpeed = function (speed)
			{
				if (!self.isActive())
				{
					self._recomputeBySpeed(speed);
					self._speed = speed;
					return;
				}

				self.pause();
				self._recomputeBySpeed(speed);
				self._speed = speed;
				self.play();
			};

			this.hasRealData = function ()
			{
				return self._realityValues.length > 0;
			}

			this.hideMap = function ()
			{
				self._vehicleLayer.setVisible(false);
				self._realityRouteLayer.setVisible(false);
				self._routeProcessor.hideMap();
				self._clearCounters();
				self._popupExtender.hide();
			};

			this.showMap = function ()
			{
				self._vehicleLayer.setVisible(true);
				self._realityRouteLayer.setVisible(true);
				self._routeProcessor.showMap();

				let feature = self._vehicleFeatures.getArray()[0];
				self._popupExtender.show(feature);
			};

			this.fitMap = function ()
			{
				if (!self._vehicleFeatures.getArray()[0])
				{
					self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
					self._map.getView().setZoom(2);
					return;
				}

				let extent = self._vehicleLayer.getSource().getExtent();
				let view = self._map.getView();

				view.fit(extent, { maxZoom: wertyz.map.settings.maxFitZoom, padding: [300, 0, 0, 0] });
			};

			this.follow = function ()
			{
				self.fitMap();
			};

			this.setObu = function (obu)
			{
				self._obu = obu;
			};

			this.getObu = function ()
			{
				return self._obu;
			};

			this.getMapExtender = function ()
			{
				return self._mapExtender;
			};

			this.isActive = function ()
			{
				return self._frameRequest !== null;
			};

			this._init();
		},

		Value: function (data)
		{
			this.date = wertyz.helper.getDateFromShiftedUTCString(new Date(data["T"]));
			this.time = data["+"] * 1000; //sec -> millisec
			this.lastCommunication = data["T"];
			this.obu = data["O"];
			this.vin = data["V"];
			this.licence = data["P"];
			this.order = data["d"];
			this.line = data["l"];
			this.lineDescription = data["L"];
			this.lineId = data["l"];
			this.trip = data["t"];
			this.speed = data["S"];
			this.driverName = data["D"];
			this.routeNumber = data["r"];

			if (data["-"])
				this.latitude = data["-"] / 100000; //int -> decimal
			if (data["|"])
				this.longitude = data["|"] / 100000; //int -> decimal
		}
	};

	this.track =
	{
		instant: new function ()
		{
			wertyz.map.instant.IWrapper.call(this);
			//wertyz.helper.assignFunctionToObject(this, wertyz.map.instant.IWrapper);

			let self = this;

			this.show = function (/*parameters*/tracks, options)
			{
				if (!self._processor)
				{
					self._init(options); //IWrapper._init											
					self._processor = new wertyz.map.vehicle.track.Processor(self._mapExtender, tracks);
				}
				else
				{
					self._processor.refresh(tracks);
				}

				self.showMap(options);
				self._processor.fitMap();
			};
		},

		Processor: function (mapExtender, tracks)
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			let self = this;
			this._mapExtender = mapExtender;
			this._map = mapExtender.getMap();
			this._trackLayer = null;
			this._trackFeatures = new ol.Collection();

			this._init = function (tracks)
			{
				self._createFeatures(tracks);

				let trackLayer = new ol.layer.Vector(
					{
						name: "Tracks",
						source: new ol.source.Vector(
							{
								features: self._trackFeatures
							}),
						zIndex: 2,
						style: self._styleGenerator.getStyle
					});

				self._trackLayer = trackLayer;
				self._map.addLayer(trackLayer);
			};

			this._createFeatures = function (tracks)
			{
				for (let i = 0; i < tracks.length; i++)
				{
					let track = tracks[i];
					let polygonArray = [];

					for (j = 0; j < track.points.length; j++)
					{
						let trackPoint = track.points[j];
						let longitude = trackPoint["|"] / 100000;
						let latitude = trackPoint["-"] / 100000;

						polygonArray.push(ol.proj.transform([longitude, latitude],
							"EPSG:4326",
							"EPSG:3857"));
					}

					//Route             
					let lineString = new ol.geom.LineString(polygonArray);
					let trackFeature = new ol.Feature(
						{
							geometry: lineString,
							type: "track"
						});

					self._trackFeatures.push(trackFeature);
				}
			};

			this._styleGenerator = new function ()
			{
				this.getStyle = function (feature)
				{
					let lineStringStyle = wertyz.map.route.ol.getStyle(feature);

					return lineStringStyle;
				}
			};

			this.refresh = function (tracks)
			{
				self.clear();
				self._createFeatures(tracks);
			};

			this.clear = function ()
			{
				self._trackFeatures.clear();
			};

			this.getMap = function ()
			{
				return self._map;
			};

			this.getTrackFeatures = function ()
			{
				return self._trackFeatures;
			};

			this.getExtent = function ()
			{
				let extent = self._trackLayer.getSource().getExtent();

				return extent;
			};

			this.fitMap = function (options)
			{
				if (!self._trackFeatures.getLength())
				{
					self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
					self._map.getView().setZoom(2);
					return;
				}

				let extent = self.getExtent();
				self._map.getView().fit(extent, options);
			};

			this.hideMap = function ()
			{
				self._trackLayer.setVisible(false);
			};

			this.showMap = function ()
			{
				self._trackLayer.setVisible(true);
			};

			this._init(tracks);
		}
	};

	this.Processor = function (mapExtender, optVehicles)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;

		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._vehicles = optVehicles || [];
		this._clusterSource = null;
		this._clusterLayer = null;
		this._features = [];
		this._visibleFeatures = [];
		this._hiddenFeatures = [];
		this._filter = null;

		this._axGet = function (parameters, options)
		{
			let obus = parameters
				? JSON.stringify(parameters.obus)
				: null;

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.getVehiclesUrl,
					//contentType: "application/json",
					data: { obus: obus }
				})
				.done(function (data, textStatus, jqXhr)
				{
					if (options && options.done)
						options.done(data, textStatus, jqXhr);
				})
				.fail(function (data, textStatus, error)
				{
					if (options && options.fail)
						options.fail(data, textStatus, error);
				})
				.always(function ()
				{
					if (options && options.always)
						options.always();
				});
		};

		this._init = function (vehicles)
		{
			let clusterSource = new ol.source.Cluster(
				{
					distance: wertyz.map.settings.vehicle.getClusterDistance(),
					source: new ol.source.Vector()
				});
			clusterSource.on("change", function (e)
			{
				self.event.call("clusterchange", e);
			});

			let clusterLayer = new ol.layer.AnimatedCluster(
				{
					name: "Vehicles",
					source: clusterSource,
					animationDuration: 200,
					zIndex: 8,
					style: wertyz.map.vehicle.ol.getStyle
				});

			self._clusterSource = clusterSource;
			self._clusterLayer = clusterLayer;
			self._map.addLayer(clusterLayer);

			if (!vehicles || !vehicles.length)
				return;

			self._createFeatures(vehicles, self._filter);
			self._showFeatures();
		};

		this._getFeatureOptions = function (vehicle)
		{
			let featureOptions =
			{
				obu: vehicle.obu,
				vin: vehicle.vin,
				licence: vehicle.licence,
				latitude: vehicle.latitude,
				longitude: vehicle.longitude,
				altitude: vehicle.altitude,
				driverName: vehicle.driverName,
				driverNumber: vehicle.driverNumber,
				order: vehicle.order,
				orderColor: vehicle.orderColor,
				line: vehicle.line,
				trip: vehicle.trip,
				tripDate: vehicle.tripDate,
				tripColor: vehicle.tripColor,
				routeNumber: vehicle.routeNumber,
				planned: vehicle.planned,
				stopId: vehicle.stopId,
				platform: vehicle.platform,
				nextStopArrival: vehicle.nextStopArrival,
				finalStopArrival: vehicle.finalStopArrival,
				passenger: vehicle.passengerNumber,
				passengerCapacityUsage: vehicle.passengerCapacityUsage,
				delay: vehicle.delay,
				deviation: vehicle.deviation,
				deviationGps: vehicle.deviationGps,
				invalidGps: vehicle.invalidGps,
				speed: vehicle.speed,
				azimuth: vehicle.azimuth,
				state: vehicle.state,
				stateColor: vehicle.stateColor,
				stateColorExtended: vehicle.stateColorExtended,
				isCommunicating: vehicle.communication,
				isCommunicating24h: vehicle.communication24h,
				isCommunicatingAfterActualDutyEnd1h: vehicle.communicationDuty1h,
				lastCommunication: vehicle.lastCommunication,
				garageNumber: vehicle.garageNumber,
				garageStatus: vehicle.garageStatus,
				obuState: vehicle.obuState,

				//StatusId
				statusIdCommunication: vehicle.statusIdCommunication,
				//statusIdCommunication24h: vehicle.statusIdCommunication24h,
				//statusIdCommunicationDuty1h: vehicle.statusIdCommunicationDuty1h,
				statusIdGarage: vehicle.statusIdGarage,
				statusIdGpsValidation: vehicle.statusIdGpsValidation,
				statusIdOccupacy: vehicle.statusIdOccupacy,
				statusIdObuState: vehicle.statusIdObuState,
				statusIdTripRoute: vehicle.statusIdTripRoute,

				//Map
				isFollowed: false,
				type: "vehicle",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([vehicle.longitude, vehicle.latitude]))
			};

			if (wertyz.map.settings.vehicle.getFollowedObu() === vehicle.obu)
				featureOptions.isFollowed = true;

			return featureOptions;
		};

		this._filterProtoArray = function (vehicles)
		{
			let ret =
			{
				passed: [],
				notPassed: []
			}

			for (let i = 0; i < vehicles.length; i++)
			{
				let vehicle = vehicles[i];

				if (self._filter)
				{
					let obuString = wertyz.helper.removeDiacritic(vehicle.obu.toString()).toLowerCase();
					let vinString = wertyz.helper.removeDiacritic((vehicle.vin || "").toString()).toLowerCase();
					let licenceString = wertyz.helper.removeDiacritic(vehicle.licence || "").toLowerCase();
					let driverNameString = wertyz.helper.removeDiacritic(vehicle.driverName || "").toLowerCase();
					let passed = self._checkFilterPassed(obuString, vinString, licenceString, driverNameString);

					if (!passed)
					{
						ret.notPassed.push(vehicle);
						continue;
					}
				}

				ret.passed.push(vehicle);
			}

			return ret;
		};

		this._filterFeatures = function ()
		{
			self._visibleFeatures = [];
			self._hiddenFeatures = [];

			for (let i = 0; i < self._features.length; i++)
			{
				let feature = self._features[i];

				if (self._filter)
				{
					let obuString = wertyz.helper.removeDiacritic(feature.get("obu").toString()).toLowerCase();
					let vinString = wertyz.helper.removeDiacritic((feature.get("vin") || "").toString()).toLowerCase();
					let licenceString = wertyz.helper.removeDiacritic(feature.get("licence") || "").toLowerCase();
					let driverNameString = wertyz.helper.removeDiacritic(feature.get("driverName") || "").toLowerCase();
					let passed = self._checkFilterPassed(obuString, vinString, licenceString, driverNameString);

					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._testVehicleByFilter = function (vehicle)
		{
			let obuString = wertyz.helper.removeDiacritic(vehicle.obu.toString()).toLowerCase();
			let vinString = wertyz.helper.removeDiacritic((vehicle.vin || "").toString()).toLowerCase();
			let licenceString = wertyz.helper.removeDiacritic(vehicle.licence || "").toLowerCase();
			let driverNameString = wertyz.helper.removeDiacritic(vehicle.driverName || "").toLowerCase();
			let passed = self._checkFilterPassed(obuString, vinString, licenceString, driverNameString);

			return passed;
		};

		this._testFeatureByFilter = function (feature)
		{
			let obuString = wertyz.helper.removeDiacritic(feature.get("obu").toString()).toLowerCase();
			let vinString = wertyz.helper.removeDiacritic((feature.get("vin") || "").toString()).toLowerCase();
			let licenceString = wertyz.helper.removeDiacritic(feature.get("licence") || "").toLowerCase();
			let driverNameString = wertyz.helper.removeDiacritic(feature.get("driverName") || "").toLowerCase();
			let passed = self._checkFilterPassed(obuString, vinString, licenceString, driverNameString);

			return passed;
		};

		this._checkFilterPassed = function (obuString, vinString, licenceString, driverNameString)
		{
			let passed = obuString.indexOf(self._filter) > -1 ||
				vinString.indexOf(self._filter) > -1 ||
				licenceString.indexOf(self._filter) > -1 ||
				driverNameString.indexOf(self._filter) > -1;

			return passed;
		};

		this._createFeature = function (vehicle)
		{
			let featureOptions = self._getFeatureOptions(vehicle);
			let feature = new ol.Feature(featureOptions);

			return feature;
		};

		this._createFeatures = function (vehicles)
		{
			for (let i = 0; i < vehicles.length; i++)
			{
				let vehicle = vehicles[i];
				let feature = self._createFeature(vehicle);

				self._features.push(feature);

				if (self._filter)
				{
					let passed = self._testVehicleByFilter(vehicle, self._filter);
					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._showFeatures = function ()
		{
			self._clusterSource.getSource().addFeatures(self._visibleFeatures);
		};

		this.load = function (parameters, options)
		{
			self._axGet(parameters, options);
		};

		this.refresh = function (vehicles)
		{
			self._vehicles = vehicles;
			self._clusterLayer.setSaveClusterOnChange(false);
			self.clear();
			self._createFeatures(vehicles);
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
			self.event.call("refresh");
		};

		this.add = function (vehicles)
		{
			self._vehicles = self._vehicles.concat(vehicles);
			self._clusterLayer.setSaveClusterOnChange(false);
			self.clear();
			self._createFeatures(self._vehicles);
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
			self.event.call("refresh");
		};

		this.getVehicles = function ()
		{
			return self._vehicles;
		};

		this.getFeature = function (obu)
		{
			let feature = self._features.find((feature) =>
			{
				return feature.get("obu") === obu;
			});

			return feature;
		};

		this.getFollowedFeature = function ()
		{
			let feature = self._features.find((feature) =>
			{
				return feature.get("isFollowed") === true;
			});

			return feature;
		};

		this.getVisibleFeature = function (obu)
		{
			let feature = self._visibleFeatures.find(function (ft)
			{
				return ft.get("obu") === obu;
			});

			return feature;
		};

		this.getFeatures = function ()
		{
			return self._features;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getClusterSource = function ()
		{
			return self._clusterSource;
		};

		this.getClusterLayer = function ()
		{
			return self._clusterLayer;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			return self._clusterLayer.getSource().getSource().getExtent();
		};

		this.getMapExtender = function ()
		{
			return self._mapExtender;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.fitMap = function (options)
		{
			let view = self._map.getView();

			if (!self._visibleFeatures.length)
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			let maxZoom = options
				? (options.maxZoom || wertyz.map.settings.maxFitZoom)
				: wertyz.map.settings.maxFitZoom;
			let padding = options
				? (options.padding || [0, 0, 0, 0])
				: [0, 0, 0, 0];

			view.fit(extent, { maxZoom: maxZoom, padding: padding });
		};

		this.centerMap = function (obu)
		{
			let feature = self.getVisibleFeature(obu);

			if (feature)
				self._mapExtender.center(feature);
		};

		this.clear = function ()
		{
			self._clusterSource.getSource().clear();
			self._features.length = 0;
			self._visibleFeatures.length = 0;
			self._hiddenFeatures.length = 0;
		};

		this.setFilter = function (filter, optSilent)
		{
			self._filter = filter;

			if (optSilent)
				return;

			self._clusterLayer.setSaveClusterOnChange(false);
			self._clusterSource.getSource().clear();
			self._filterFeatures();
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();

			if (self._visibleFeatures.length === 1)
				self._mapExtender.centerPan(self._visibleFeatures[0]);
		};

		this.setFollowedObu = function (obu)
		{
			let feature = self.getFollowedFeature();
			if (feature && feature.get("obu") === obu)
				return;

			if (feature)
				feature.set("isFollowed", false);

			if (obu)
			{
				feature = self.getFeature(obu);
				if (feature)
				{
					feature.set("isFollowed", true);
					self.centerMap(obu);
				}
			}
		};

		this.setClusterDistance = function (clusterDistance)
		{
			self._clusterSource.setDistance(clusterDistance);
		};

		this.getResolution = function (coords)
		{
			let view = self._map.getView();
			let resolution = view.getResolution();
			let projection = view.getProjection();

			if (!coords)
				coords = view.getCenter();

			let resolutionAtCoords = projection.getPointResolution(resolution, coords);

			return resolutionAtCoords;
		};

		this._init(optVehicles);
	};
};

wertyz.map.alarm =
{
	type:
	{
		getIconPath: function (type, subtype, options)
		{
			let iconPath;

			if (type === "PanicButton")
				iconPath = "Alarm/PanicButton";
			else
				iconPath = "Alarm/" /*+ type*/ + (subtype || 1); //TODo dat prec || 1

			if (options && options.iconCenter)
				iconPath += "_center";

			return iconPath;
		}
	},

	ol:
	{
		getStyle: function (feature, resolution, options)
		{
			let features = feature.get("features");
			let image;
			let font;
			let color;
			let fillColor = "#000";
			let textOffsetX = -1;
			let textOffsetY = -36;
			let text = "";
			let iconName = "";
			let iconSize = [26, 31];
			let iconAnchor = [0.5, 1.0];
			let styles = [];
			let style;

			if (features && features.length === 1)
			{ //One feature
				feature = features[0];

				let alarmType = feature.get("alarmType");
				let alarmSubtype = feature.get("alarmSubtype");

				iconName = wertyz.map.alarm.type.getIconPath(alarmType, alarmSubtype, options);

				if (options && options.iconCenter)
					iconAnchor = [0.5, 0.5];

				image = new ol.style.Icon(
					{
						size: iconSize,
						anchor: iconAnchor,
						src: wertyz.map.settings.contentUrl + "/" + iconName + ".png"
					});

				if (options && wertyz.helper.isNumber(options.iconAlpha))
					image.setOpacity(options.iconAlpha);
			}
			else if (features)
			{ //Cluster

				let size = features.length;
				let radius = Math.max(/*min*/12, Math.min(size * 0.3, /*max*/18));

				font = "bold 11px sans-serif";
				color = "0, 0, 0";
				iconSize = [28, 28];
				text = size.toString();
				fillColor = "#fff";
				textOffsetX = 0;
				textOffsetY = 0;

				image = new ol.style.Circle(
					{
						fill: new ol.style.Fill({ color: "rgba(220, 0, 0, 0.65)" }),
						stroke: new ol.style.Stroke({ color: "rgba(0, 0, 0, 0.45)", width: 2 }),
						radius: radius
					});
			}

			//console.log(features, image);

			styles.push(new ol.style.Style(
				{
					image: image,
					text: new ol.style.Text(
						{
							font: font,
							text: text,
							fill: new ol.style.Fill(
								{
									color: fillColor
								}),
							offsetX: textOffsetX,
							offsetY: textOffsetY
						})
				}));

			return styles;
		}
	},

	filter: new function ()
	{
		let self = this;

		this.apply = function (filter, alarms)
		{
			return alarms;
		};
	},

	Processor: function (mapExtender, alarms)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._alarms = alarms || [];
		this._clusterSource = null;
		this._clusterLayer = null;
		this._features = [];
		this._visibleFeatures = [];
		this._hiddenFeatures = [];
		this._filter = null;

		this._init = function (alarms)
		{
			let clusterSource = new ol.source.Cluster(
				{
					distance: wertyz.map.settings.alarm.getClusterDistance(),
					source: new ol.source.Vector()
				});

			clusterSource.on("change", function (e)
			{
				self.event.call("clusterchange", e);
			});

			let clusterLayer = new ol.layer.AnimatedCluster(
				{
					name: "Alarms",
					source: clusterSource,
					animationDuration: 200,
					zIndex: 9,
					style: wertyz.map.alarm.ol.getStyle
				});

			self._clusterSource = clusterSource;
			self._clusterLayer = clusterLayer;
			self._map.addLayer(clusterLayer);

			wertyz.map.common.selectCluster.getOrCreateSelectClusterInteraction(self._map, clusterLayer, wertyz.map.alarm.ol.getStyle);

			if (!alarms || !alarms.length)
				return;

			self._createFeatures(alarms, self._filter);
			self._showFeatures();
		};

		this._axGet = function (parameters, options)
		{
			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.getAlarmsUrl
				})
				.done(function (data, textStatus, jqXhr)
				{
					if (options && options.done)
						options.done(data, textStatus, jqXhr);
				})
				.fail(function (data, textStatus, error)
				{
					if (options && options.fail)
						options.fail(data, textStatus, error);
				})
				.always(function ()
				{
					if (options && options.always)
						options.always();
				});
		};

		this._getFeatureOptions = function (alarm)
		{
			let featureOptions =
			{
				id: alarm.id,
				alarmType: alarm.type,
				alarmSubtype: alarm.subtype,
				latitude: alarm.latitude,
				longitude: alarm.longitude,
				sendedAt: alarm.sendedAt,
				receivedAt: alarm.receivedAt,
				obu: alarm.obu,
				vin: alarm.vin,
				licence: alarm.licence,
				order: alarm.order,
				line: alarm.line,
				trip: alarm.trip,
				driverName: alarm.driverName,
				type: "alarm",

				geometry: new ol.geom.Point(ol.proj.fromLonLat([alarm.longitude, alarm.latitude]))
			};

			return featureOptions;
		};

		this._filterProtoArray = function (alarms)
		{
			let ret =
			{
				passed: [],
				notPassed: []
			}

			for (let i = 0; i < alarms.length; i++)
			{
				let alarm = alarms[i];

				if (self._filter)
				{
					let obu = wertyz.helper.removeDiacritic(alarm.Obu.toString()).toLowerCase();
					let vin = wertyz.helper.removeDiacritic(alarm.Vin.toString()).toLowerCase();
					let licence = wertyz.helper.removeDiacritic(alarm.Licence.toString()).toLowerCase();
					let hasPassed = obu.indexOf(self._filter) > -1 ||
						vin.indexOf(self._filter) > -1 ||
						licence.indexOf(self._filter) > -1;

					if (!hasPassed)
					{
						ret.notPassed.push(alarm);
						continue;
					}
				}

				ret.passed.push(alarm);
			}

			return ret;
		};

		this._filterFeatures = function ()
		{
			self._visibleFeatures = [];
			self._hiddenFeatures = [];

			for (let i = 0; i < self._features.length; i++)
			{
				let feature = self._features[i];

				if (self._filter)
				{
					let obu = wertyz.helper.removeDiacritic(feature.get("obu").toString()).toLowerCase();
					let vin = wertyz.helper.removeDiacritic(feature.get("vin").toString()).toLowerCase();
					let licence = wertyz.helper.removeDiacritic(feature.get("licence").toString()).toLowerCase();
					let passed = obu.indexOf(self._filter) > -1 ||
						vin.indexOf(self._filter) > -1 ||
						licence.indexOf(self._filter) > -1;

					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._testAlarmByFilter = function (alarm)
		{
			let obu = wertyz.helper.removeDiacritic(alarm.Obu.toString()).toLowerCase();
			let vin = wertyz.helper.removeDiacritic(alarm.Vin.toString()).toLowerCase();
			let licence = wertyz.helper.removeDiacritic(alarm.Licence.toString()).toLowerCase();
			let passed = obu.indexOf(self._filter) > -1 ||
				vin.indexOf(self._filter) > -1 ||
				licence.indexOf(self._filter) > -1;

			return passed;
		};

		this._testFeatureByFilter = function (feature)
		{
			let obu = wertyz.helper.removeDiacritic(feature.get("obu").toString()).toLowerCase();
			let vin = wertyz.helper.removeDiacritic(feature.get("vin").toString()).toLowerCase();
			let licence = wertyz.helper.removeDiacritic(feature.get("licence").toString()).toLowerCase();
			let passed = obu.indexOf(self._filter) > -1 ||
				vin.indexOf(self._filter) > -1 ||
				licence.indexOf(self._filter) > -1;

			return passed;
		};

		this._createFeature = function (alarm)
		{
			//if (!alarm.latitude || !alarm.longitude)
			//   return null;

			let featureOptions = self._getFeatureOptions(alarm);
			let feature = new ol.Feature(featureOptions);

			return feature;
		};

		this._createFeatures = function (alarms)
		{
			for (let i = 0; i < alarms.length; i++)
			{
				let alarm = alarms[i];
				let feature = self._createFeature(alarm);

				self._features.push(feature);

				if (self._filter)
				{
					let passed = self._testAlarmByFilter(alarm, self._filter);
					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._showFeatures = function ()
		{
			self._clusterSource.getSource().addFeatures(self._visibleFeatures);
		};

		this.load = function (parameters, options)
		{
			self._axGet(parameters, options);
		};

		this.refresh = function (alarms)
		{
			self._alarms = alarms;
			self._clusterLayer.setSaveClusterOnChange(false);
			self.clear();
			self._createFeatures(alarms);
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
			self.event.call("refresh");
		};

		this.add = function (alarms)
		{
			self._alarms = self._alarms.concat(alarms);
			self._clusterLayer.setSaveClusterOnChange(false);
			self.clear();
			self._createFeatures(self._alarms);
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
			self.event.call("refresh");
		};

		this.getFeature = function (alarmId)
		{
			for (let i = 0; i < self._features.length; i++)
			{
				let feature = self._features[i];
				if (feature.get("id") === alarmId)
					return feature;
			}

			return null;
		};

		this.getVisibleFeature = function (alarmId)
		{
			let feature = self._visibleFeatures.find(function (ft)
			{
				return ft.get("id") === alarmId;
			});

			return feature;
		};

		this.removeFeaturesByAlarmIds = function (alarmIds)
		{
			alarmIds.forEach((alarmId) =>
			{
				let feature = self.getFeature(alarmId);
				if (!feature)
					return;

				let index = self._features.indexOf(feature);
				self._features.splice(index, 1);

				index = self._visibleFeatures.indexOf(feature);
				if (index > -1)
				{
					self._visibleFeatures.splice(index, 1);
					self._clusterSource.getSource().removeFeature(feature);
					return;
				}

				index = self._hiddenFeatures.indexOf(feature);
				if (index > -1)
					self._hiddenFeatures.splice(index, 1);
			});
		};

		this.getFeatures = function ()
		{
			return self._features;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getClusterSource = function ()
		{
			return self._clusterSource;
		};

		this.getClusterLayer = function ()
		{
			return self._clusterLayer;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			return self._clusterLayer.getSource().getSource().getExtent();
		};

		this.getMapExtender = function ()
		{
			return self._mapExtender;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.fitMap = function ()
		{
			let view = self._map.getView();

			if (!self._features.length)
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			view.fit(extent, { maxZoom: wertyz.map.settings.maxFitZoom });
		};

		this.centerMap = function (alarmId)
		{
			let feature = self.getVisibleFeature(alarmId);

			if (feature)
				self._mapExtender.center(feature);
		};

		this.clear = function ()
		{
			self._clusterSource.getSource().clear();
			self._features.length = 0;
			self._visibleFeatures.length = 0;
			self._hiddenFeatures.length = 0;
		};

		this.setFilter = function (filter, optSilent)
		{
			self._filter = filter;

			if (optSilent)
				return;

			self._clusterLayer.setSaveClusterOnChange(false);
			self._clusterSource.getSource().clear();
			self._filterFeatures();
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
		};

		this.setClusterDistance = function (clusterDistance)
		{
			self._clusterSource.setDistance(clusterDistance);
		};

		this.getResolution = function (coords)
		{
			let view = self._map.getView();
			let resolution = view.getResolution();
			let projection = view.getProjection();

			if (!coords)
				coords = view.getCenter();

			let resolutionAtCoords = projection.getPointResolution(resolution, coords);

			return resolutionAtCoords;
		};

		this._init(alarms);
	}
};

wertyz.map.garage =
{
	ol:
	{
		getStyle: function (feature, resolution)
		{
			let textSize = Math.min(20, 30 / resolution); //max 20
			let text = feature.get("parkingId") + " - " + feature.get("parkingName");

			let style = new ol.style.Style(
				{
					text: new ol.style.Text(
						{
							font: "bold " + textSize + "px sans-serif",
							text: text,
							overflow: true,
							fill: new ol.style.Fill(
								{
									color: "#fff"
								})
						}),
					fill: new ol.style.Fill({ color: "rgba(0, 0, 0, 0.25)" })
				});

			return style;
		}
	},

	Processor: function (mapExtender, optGarages)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;

		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._layer = null;
		this._features = [];
		this._hiddenFeatures = [];
		this._visibleFeatures = new ol.Collection();
		this._filter = null;

		this._axGet = function (parameters, options)
		{
			let garageIds = parameters
				? JSON.stringify(parameters.garageIds)
				: "[]";

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.getGaragesAndParkingsUrl,
					data: { garageIds: garageIds }
				})
				.done(function (data, textStatus, jqXhr)
				{
					if (options && options.done)
						options.done(data, textStatus, jqXhr);
				})
				.fail(function (data, textStatus, error)
				{
					if (options && options.fail)
						options.fail(data, textStatus, error);
				})
				.always(function ()
				{
					if (options && options.always)
						options.always();
				});
		};

		this._init = function (garages)
		{
			let layer = new ol.layer.Vector(
				{
					name: "Garages",
					source: new ol.source.Vector(
						{
							features: self._visibleFeatures
						}),
					style: wertyz.map.garage.ol.getStyle
				});

			self._layer = layer;
			self._map.addLayer(layer);

			if (!garages || !garages.length)
				return;

			self._createFeatures(garages, self._filter);
		};

		this._getFeatureOptions = function (parking, optGarage)
		{
			let featureOptions =
			{
				//Parking
				parkingId: parking.id,
				parkingName: parking.name,
				points: parking.points,

				//Garage
				//garageId: optGarage ? optGarage.id : null,
				//garageName: optGarage ? optGarage.name : null,

				type: "parking"
			};

			let polygonCords = [];
			parking.points.forEach((point) =>
			{
				polygonCords.push(ol.proj.fromLonLat([point.longitude, point.latitude]));
			});
			polygonCords.push(polygonCords[0]);
			featureOptions.geometry = new ol.geom.Polygon([polygonCords]);
			//featureOptions.geometry = new ol.geom.Circle(ol.proj.fromLonLat([parking.points[0].longitude, parking.points[0].latitude]), 500);

			return featureOptions;
		};

		this._filterProtoArray = function (garages)
		{
			let ret =
			{
				passed: [],
				notPassed: []
			}

			for (let i = 0; i < garages.length; i++)
			{
				let garage = garages[i];

				if (self._filter)
				{
					let garageIdString = wertyz.helper.removeDiacritic(garage.garageId.toString()).toLowerCase();
					let garageName = wertyz.helper.removeDiacritic((garage.name || "")).toLowerCase();
					let passed = self._checkFilterPassed(garageIdString, garageName);

					if (!passed)
					{
						ret.notPassed.push(garage);
						continue;
					}
				}

				ret.passed.push(garage);
			}

			return ret;
		};

		this._filterFeatures = function ()
		{
			self._visibleFeatures.clear();
			self._hiddenFeatures = [];

			for (let i = 0; i < self._features.length; i++)
			{
				let feature = self._features[i];

				if (self._filter)
				{
					let garageIdString = wertyz.helper.removeDiacritic(feature.get("garageId").toString()).toLowerCase();
					let garageName = wertyz.helper.removeDiacritic((feature.get("name") || "")).toLowerCase();
					let passed = self._checkFilterPassed(garageIdString, garageName);

					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._testGarageByFilter = function (garage)
		{
			let garageIdString = wertyz.helper.removeDiacritic(garage.garageId.toString()).toLowerCase();
			let garageName = wertyz.helper.removeDiacritic((garage.name || "")).toLowerCase();
			let passed = self._checkFilterPassed(garageIdString, garageName);

			return passed;
		};

		this._testFeatureByFilter = function (feature)
		{
			let garageIdString = wertyz.helper.removeDiacritic(feature.get("garageId").toString()).toLowerCase();
			let garageName = wertyz.helper.removeDiacritic((feature.get("name") || "")).toLowerCase();
			let passed = self._checkFilterPassed(garageIdString, garageName);

			return passed;
		};

		this._checkFilterPassed = function (garageIdString, garageName)
		{
			let passed = garageIdString.indexOf(self._filter) > -1 || garageName.indexOf(self._filter) > -1;

			return passed;
		};

		this._createFeature = function (parking, optGarage)
		{
			let featureOptions = self._getFeatureOptions(parking, optGarage);
			let feature = new ol.Feature(featureOptions);

			return feature;
		};

		this._createFeatures = function (garages)
		{
			let createParkingFeatures = function (parkings, optGarage)
			{
				//if garage ...

				for (let i = 0; i < parkings.length; i++)
				{
					let parking = parkings[i];
					let feature = self._createFeature(parking, optGarage);

					self._features.push(feature);

					if (self._filter)
					{
						let passed = self._testGarageByFilter(parking, self._filter);
						if (!passed)
						{
							self._hiddenFeatures.push(feature);
							continue;
						}
					}

					self._visibleFeatures.push(feature);
				}
			}

			for (let i = 0; i < garages.garages.length; i++)
			{
				let garage = garages.garages[i];
				createParkingFeatures(garage.parkings, garage);
			}

			createParkingFeatures(garages.parkings, null);
		};

		this.load = function (parameters, options)
		{
			self._axGet(parameters, options);
		};

		this.refresh = function (garages)
		{
			self.clear();
			self._createFeatures(garages);
			self.event.call("refresh");
		};

		this.getFeature = function (garageId)
		{
			let feature = self._features.find((feature) =>
			{
				return feature.get("garageId") === garageId;
			});

			return feature;
		};

		this.getVisibleFeature = function (garageId)
		{
			let feature = self._visibleFeatures.getArray().find(function (ft)
			{
				return ft.get("garageId") === garageId;
			});

			return feature;
		};

		this.getFeatures = function ()
		{
			return self._features;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			let extent = self._layer.getSource().getExtent();

			return extent;
		};

		this.getMapExtender = function ()
		{
			return self._mapExtender;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.fitMap = function ()
		{
			let view = self._map.getView();

			if (!self._visibleFeatures.getLength())
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			view.fit(extent, { maxZoom: wertyz.map.settings.maxFitZoom });
		};

		this.clear = function ()
		{
			self._features.length = 0;
			self._hiddenFeatures.length = 0;
			self._visibleFeatures.clear();
		};

		this.setFilter = function (filter, optSilent)
		{
			self._filter = filter;

			if (optSilent)
				return;

			self._clusterLayer.setSaveClusterOnChange(false);
			self._clusterSource.getSource().clear();
			self._filterFeatures();
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();

			if (self._visibleFeatures.getLength() === 1)
				self._mapExtender.centerPan(self._visibleFeatures.item(0));
		};

		this.getResolution = function (coords)
		{
			let view = self._map.getView();
			let resolution = view.getResolution();
			let projection = view.getProjection();

			if (!coords)
				coords = view.getCenter();

			let resolutionAtCoords = projection.getPointResolution(resolution, coords);

			return resolutionAtCoords;
		};

		this._init(optGarages);
	}
};

wertyz.map.trip =
{
	state:
	{
		ColorMap: [/*Default*/"", "White", "Green", "Red", "Orange", "Black"],

		getIconPath: function (stateColor, options)
		{
			let iconPath = "Trip/tripFlag" + wertyz.map.trip.state.ColorMap[stateColor];

			if (options && options.iconCenter)
				iconPath += "_center";

			return iconPath;
		},
	},

	ol:
	{
		getStyle: function (feature, resolution, options)
		{
			let features = feature.get("features");
			let styles = [];

			if (!features || (features && features.length === 1))
			{ //One feature
				if (features)
					feature = features[0];

				let line = feature.get("line");
				let trip = feature.get("trip");
				let activeVehicle = feature.get("activeVehicle");
				let iconName = "";
				let iconAnchor = [0.16, 1.0];
				let iconOpacity = 0.5;
				let fillColor = "#fff";
				let stateColor = feature.get("stateColor");
				let textOffsetX = -4;
				let textOffsetY = -20;

				if (!stateColor)
					stateColor = 5; //Black
				if (stateColor === 1 || stateColor === 5)
					fillColor = "#000";

				iconName += wertyz.map.trip.state.getIconPath(stateColor, options);

				if (options && options.iconCenter)
					iconAnchor = [0.5, 0.5];

				if (activeVehicle)
				{
					styles.push(new ol.style.Style(
						{
							image: new ol.style.Circle({
								fill: new ol.style.Fill({
									color: "rgba(255, 0, 0, 0.5)"
								}),
								stroke: new ol.style.Stroke({
									color: "#ffffff",
									width: 1.25
								}),
								radius: 8
							})
						}));
				}

				if (options && wertyz.helper.isNumber(options.iconAlpha))
					iconOpacity = options.iconAlpha;
				if (options && wertyz.helper.isNumber(options.iconCenter))
				{
					textOffsetX = -19;
					textOffsetY = -4;
				}

				let image = new ol.style.Icon(
					{
						size: [43, 33],
						anchor: iconAnchor,
						src: wertyz.map.settings.contentUrl + "/" + iconName + ".png",
						opacity: iconOpacity
					});

				styles.push(new ol.style.Style(
					{
						image: image,
						text: (new ol.style.Text(
							{
								fill: new ol.style.Fill(
									{
										color: fillColor
									}),
								text: line + "\n" + trip.toString(),
								textAlign: "left",
								font: "bold 10px Verdana",
								offsetX: textOffsetX,
								offsetY: textOffsetY
							}))
					}));
			}
			else if (features)
			{ //Cluster

				let size = features.length;
				let radius = Math.max(/*min*/12, Math.min(size * 0.3, /*max*/18));

				let font = "bold 11px sans-serif";
				let text = size.toString();
				let textOffsetX = 0;
				let textOffsetY = 0;

				let image = new ol.style.Circle(
					{
						fill: new ol.style.Fill({ color: "rgba(43, 131, 203, 0.85)" }),
						stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 1.0)", width: 2 }),
						radius: radius
					});

				let textStyle = new ol.style.Text(
					{
						font: font,
						text: text,
						fill: new ol.style.Fill(
							{
								color: "#fff"
							}),
						offsetX: textOffsetX,
						offsetY: textOffsetY
					});

				styles.push(new ol.style.Style(
					{
						image: image,
						text: textStyle
					}));
			}

			return styles;
		},

		getFillColorForText: function (tripColor)
		{
			switch (tripColor)
			{
				case 2:
					return "#009999"; //Green
				case 3:
					return "#ff0000"; //Red                        
				case 4:
					return "#ff7a08"; //Orange                       
				default:
					return "#000000"; //Black                
			}
		},

		getFontForText: function (tripColor)
		{
			switch (tripColor)
			{
				case 3:
					return "bold 12px sans-serif";
				default:
					return "bold 10px sans-serif";
			}
		}
	},

	animation:
	{
		Processor: function (mapExtender, routes, options)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.common.connection.IConnectionProcessor);

			let self = this;

			this._mapExtender = mapExtender;
			this._map = mapExtender.getMap();
			this._routes = routes;
			this._tripStates = [];
			this._frameRequest = null;
			this._tripLayer = null;
			this._feature = null;
			this._features = new ol.Collection();
			this._featureMapper = {};
			this._timeShift = options ? (options.timeShift || 0) : 0;

			this._init = function ()
			{
				self._baseInit();
				self._initializeFeatureMapper();

				let tripLayer = new ol.layer.Vector(
					{
						name: "AnimationTrips",
						source: new ol.source.Vector(
							{
								features: self._features
							}),
						zIndex: 6,
						style: wertyz.map.trip.ol.getStyle
					});

				self._tripLayer = tripLayer;
				self._map.addLayer(tripLayer);
			};

			this._frame = function ()
			{
				self._routes.forEach(function (route)
				{
					route.trips.forEach(function (trip)
					{
						self._setTrip(route, trip);
					});
				});

				self.event.call("frame");
				self._frameRequest = requestAnimationFrame(self._frame);
			};

			this._clear = function ()
			{
				self._features.clear();
				self._connectionFeatures.clear();
				self._featureMapper = {};
			};

			this._initializeFeatureMapper = function ()
			{
				self._routes.forEach(function (route)
				{
					self._featureMapper[route.number] = {};

					route.trips.forEach(function (trip)
					{
						self._featureMapper[route.number][trip.tripNumber] = {};
					});
				});
			};

			this._setTrip = function (route, trip)
			{
				let feature = self._featureMapper[route.number][trip.tripNumber][trip.startDateUnixEpoch];
				let computedVariables = feature ? feature.get("computedVariables") : {};
				let computed = self._computeTripLonLat(route, trip, computedVariables);

				if (!computed.lonLat)
				{
					if (feature)
					{
						self._features.remove(feature);
						self._featureMapper[route.number][trip.tripNumber][trip.startDateUnixEpoch] = null;

						let connectionFeature = self.getConnectionFeature(trip.Line, trip.tripNumber);
						if (connectionFeature)
							self.removeConnectionFeature(connectionFeature);

						self.event.call("featureremoved", feature);
					}
					return;
				}

				if (!feature)
				{
					feature = new ol.Feature(
						{
							geometry: new ol.geom.Point(ol.proj.fromLonLat(computed.lonLat)),
							routeNumber: route.number,
							line: trip.line,
							trip: trip.tripNumber,
							stateColor: "",
							type: "route.animation"
						});

					let tripState = self._tripStates.find(function (tripState)
					{
						return trip.line === tripState.line && trip.tripNumber === tripState.trip;
					});

					if (tripState)
						feature.set("stateColor", tripState.stateColor);

					self._features.push(feature);
					self._featureMapper[route.number][trip.tripNumber][trip.startDateUnixEpoch] = feature;
					self.event.call("featureadded", feature);
				}
				else
				{
					feature.getGeometry().setCoordinates(ol.proj.fromLonLat(computed.lonLat));
				}

				feature.set("computedVariables", computed);
			};

			this._computeTripLonLat = function (route, trip, computedVariables)
			{
				let computed = {};

				let currentUnixEpoch = wertyz.helper.getCurrentUnixEpoch();
				let referenceUnixEpoch = currentUnixEpoch + self._timeShift;

				//trip starts in the future
				if (referenceUnixEpoch < (trip.startDateTimeUnixEpoch * 1000))
					return computed;

				let correction;
				let correctionTimeSum = 0;
				let segmentTime = null;
				let lastEpoch;

				for (let i = computedVariables.index || 1; i < route.points.length; i++)
				{
					let point1 = route.points[i - 1];
					let point2 = route.points[i];

					if (i === 1 || point2.segmentId !== point1.segmentId)
					{
						//new segment detected => add the whole time correction from completed segment to sum
						if (point2.segmentId !== point1.segmentId && correction)
							correctionTimeSum += correction.time * 1000;

						//read new segment time correction
						correction = trip.timeCorrections.find(tc => tc.segmentId === point2.segmentId);

						//read segment time from last segment point
						for (let j = i; j < route.points.length; j++)
						{
							let tmpPoint = route.points[j];
							if (tmpPoint.segmentId != point2.segmentId)
								break;

							segmentTime = tmpPoint.timeOnSegment;
						}
					}

					//resolve the relative point2 time correction from the whole segment time correction
					let correctionTime = 0;
					if (correction)
					{
						let timeRatio = point2.timeOnSegment / segmentTime;
						correctionTime = correction.time * timeRatio * 1000;
					}

					let epoch2 = (trip.startDateTimeUnixEpoch * 1000) + (point2.timeOnRoute * 1000) + correctionTimeSum + correctionTime;
					if (epoch2 <= referenceUnixEpoch)
					{
						lastEpoch = epoch2;
						computed.index = i;
						continue;
					}

					let epoch1 = i === 1 ? trip.startDateTimeUnixEpoch * 1000 : lastEpoch;
					let ratio = (referenceUnixEpoch - epoch1) / (epoch2 - epoch1);
                                     
					let point = wertyz.gps.intermediatePoint(
						point1.point.latitude,
						point1.point.longitude,
						point2.point.latitude,
						point2.point.longitude,
						ratio);

					computed.lonLat = [point.longitude, point.latitude];
					break;
				}

				return computed;
			};

			this.start = function ()
			{
				self._frame();
			};

			this.stop = function ()
			{
				cancelAnimationFrame(self._frameRequest);
				self._frameRequest = null;
			};

			this.refresh = function (routes)
			{
				self.stop();
				self._clear();
				self._routes = routes;
				self._initializeFeatureMapper();
				self.start();
				self.event.call("refresh");
			};

			this.clear = function ()
			{
				self.stop();
				self._clear();
				self._routes = null;
			};

			this.getVisibleFeatures = function ()
			{
				return self._features;
			};

			this.getVisibleFeature = function (line, trip)
			{
				let feature = self._features.getArray().find(function (feature)
				{
					return feature.get("line") === line && feature.get("trip") === trip;
				});

				return feature;
			};

			this.setTripStates = function (tripStates)
			{
				self._tripStates = tripStates;
			};

			this._init();
		}
	},

	Processor: function (mapExtender, optTrips)
	{
		wertyz.helper.assignFunctionToObject(this, wertyz.map.common.connection.IConnectionProcessor);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._trips = optTrips || [];
		this._clusterSource = null;
		this._clusterLayer = null;
		this._features = [];
		this._visibleFeatures = [];
		this._hiddenFeatures = [];
		this._filter = null;

		this._init = function (trips)
		{
			self._baseInit();

			let clusterSource = new ol.source.Cluster(
				{
					distance: wertyz.map.settings.trip.getClusterDistance(),
					source: new ol.source.Vector()
				});
			clusterSource.on("change", function (e)
			{
				self.event.call("clusterchange", e);
			});

			let clusterLayer = new ol.layer.AnimatedCluster(
				{
					name: "Trips",
					source: clusterSource,
					animationDuration: 200,
					zIndex: 7,
					style: wertyz.map.trip.ol.getStyle
				});

			self._clusterSource = clusterSource;
			self._clusterLayer = clusterLayer;
			self._map.addLayer(clusterLayer);

			wertyz.map.common.selectCluster.getOrCreateSelectClusterInteraction(self._map, clusterLayer, wertyz.map.trip.ol.getStyle);

			if (!trips || !trips.length)
				return;

			self._createFeatures(trips, self._filter);
			self._showFeatures();
		};

		this._getFeatureOptions = function (trip)
		{
			let featureOptions =
			{
				latitude: trip.latitude,
				longitude: trip.longitude,
				routeNumber: trip.routeNumber,
				line: trip.line,
				trip: trip.trip,
				tripDateId: trip.tripDateId,
				tripStatus: trip.tripStatus,
				stateColor: trip.stateColor,
				object: trip,

				type: "trip",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([trip.longitude, trip.latitude]))
			};

			return featureOptions;
		};

		this._createFeature = function (trip)
		{
			let featureOptions = self._getFeatureOptions(trip);
			let feature = new ol.Feature(featureOptions);

			return feature;
		};

		this._createFeatures = function (trips)
		{
			for (let i = 0; i < trips.length; i++)
			{
				let trip = trips[i];
				let feature = self._createFeature(trip);

				self._features.push(feature);

				if (self._filter)
				{
					let passed = self._testVehicleByFilter(trip, self._filter);
					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				self._visibleFeatures.push(feature);
			}
		};

		this._showFeatures = function ()
		{
			self._clusterSource.getSource().addFeatures(self._visibleFeatures);
		};

		this.refresh = function (trips)
		{
			self._trips = trips;
			self._clusterLayer.setSaveClusterOnChange(false);
			self.clear();
			self._createFeatures(trips);
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();
			self.event.call("refresh");
		};

		this.getTrips = function ()
		{
			return self._trips;
		};

		this.getVisibleFeature = function (line, trip)
		{
			let feature = self._visibleFeatures.find(function (feature)
			{
				return feature.get("line") === line && feature.get("trip") === trip;
			});

			return feature;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getFeature = function (line, trip)
		{
			let feature = self._features.find(function (feature)
			{
				return feature.get("line") === line && feature.get("trip") === trip;
			});

			return feature;
		};

		this.getFeatures = function ()
		{
			return self._features;
		};

		this.getClusterSource = function ()
		{
			return self._clusterSource;
		};

		this.getClusterLayer = function ()
		{
			return self._clusterLayer;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			return self._clusterLayer.getSource().getSource().getExtent();
		};

		this.getMapExtender = function ()
		{
			return self._mapExtender;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.fitMap = function ()
		{
			let view = self._map.getView();

			if (!self._visibleFeatures.length)
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			view.fit(extent, { maxZoom: wertyz.map.settings.maxFitZoom });
		};

		this.clear = function ()
		{
			self._clusterSource.getSource().clear();
			self._connectionFeatures.clear();
			self._features.length = 0;
			self._visibleFeatures.length = 0;
			self._hiddenFeatures.length = 0;
		};

		this.setFilter = function (filter, optSilent)
		{
			self._filter = filter;

			if (optSilent)
				return;

			self._clusterLayer.setSaveClusterOnChange(false);
			self._clusterSource.getSource().clear();
			self._filterFeatures();
			self._showFeatures();
			self._clusterLayer.setSaveClusterOnChange(true);
			self._clusterLayer.saveCluster();

			if (self._visibleFeatures.length === 1)
				self._mapExtender.centerPan(self._visibleFeatures[0]);
		};

		this.setClusterDistance = function (clusterDistance)
		{
			self._clusterSource.setDistance(clusterDistance);
		};

		this.getResolution = function (coords)
		{
			let view = self._map.getView();
			let resolution = view.getResolution();
			let projection = view.getProjection();

			if (!coords)
				coords = view.getCenter();

			let resolutionAtCoords = projection.getPointResolution(resolution, coords);

			return resolutionAtCoords;
		};

		this._init(optTrips);
	},

	TestProcessor: function (mapExtender, optTrips)
	{
		wertyz.helper.assignFunctionToObject(this, wertyz.map.common.connection.IConnectionProcessor);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._trips = optTrips || [];
		this._layer = null;
		this._features = new ol.Collection();

		this._init = function (trips)
		{
			self._baseInit();

			let layer = new ol.layer.Vector(
				{
					name: "Garages",
					source: new ol.source.Vector(
						{
							features: self._features
						}),
					style: wertyz.map.trip.ol.getStyle
				});

			self._layer = layer;
			self._map.addLayer(layer);

			if (!trips || !trips.length)
				return;

			self._createFeatures(trips, self._filter);
		};

		this._getFeatureOptions = function (trip)
		{
			let featureOptions =
			{
				latitude: trip.latitude,
				longitude: trip.longitude,
				routeNumber: trip.routeNumber,
				line: trip.line,
				trip: trip.trip,
				tripDateId: trip.tripDateId,
				tripStatus: trip.tripStatus,
				stateColor: trip.stateColor,

				type: "trip",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([trip.longitude, trip.latitude]))
			};

			return featureOptions;
		};

		this._createFeature = function (trip)
		{
			let featureOptions = self._getFeatureOptions(trip);
			let feature = new ol.Feature(featureOptions);

			return feature;
		};

		this._createFeatures = function (trips)
		{
			for (let i = 0; i < trips.length; i++)
			{
				let trip = trips[i];
				let feature = self._createFeature(trip);

				self._features.push(feature);
			}
		};

		this.getFeatures = function ()
		{
			return self._features;
		};

		this.getExtent = function ()
		{
			let extent = self._layer.getSource().getExtent();

			return extent;
		};

		this.getMapExtender = function ()
		{
			return self._mapExtender;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.fitMap = function ()
		{
			let view = self._map.getView();

			if (!self._features.getLength())
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			view.fit(extent, { maxZoom: wertyz.map.settings.maxFitZoom });
		};

		this.clear = function ()
		{
			self._features.clear();
		};

		this._init(optTrips);
	},
}

wertyz.map.point =
{
	ol:
	{
		crossportcanvas: null,

		getStyle: function (pointType, options)
		{
			switch (pointType)
			{
				case wertyz.point.PointType.STOPID:
					{
						if (options.zoom && options.zoom >= 17)
						{
							return new ol.style.Style(
								{
									image: new ol.style.Icon(
										{
											size: [32, 42],
											anchor: [0.5, 1.0],
											src: wertyz.map.settings.contentUrl + "/busstopNew.png"
										})
								});
						}
						else
						{
							return new ol.style.Style(
								{
									image: new ol.style.Circle(
										{
											radius: 4,
											fill: new ol.style.Fill(
												{
													color: "rgba(237, 51, 37, 1.0)"
												}),
											stroke: new ol.style.Stroke(
												{
													width: 2,
													color: "rgba(255, 255, 255, 1.0)"
												})
										})
								});
						}
					}
				case wertyz.point.PointType.INFOTABLE:
					{
						let iconName;
						switch (options.stateColor)
						{
							case 1:
								iconName = "infoTableNoIp.png";
								break;
							case 2:
								iconName = "infoTablePing.png";
								break;
							case 3:
								iconName = "infoTableIp.png";
								break;
							default:
								iconName = "infoTableNoIp.png";
								break;
						}

						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [19, 24],
										anchor: [0, 1.0],
										src: wertyz.map.settings.contentUrl + "/" + iconName
									})
							});
					}
				case wertyz.point.PointType.CROSSENTRY:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [13, 13],
										anchor: [0.5, 0.5],
										src: wertyz.map.settings.contentUrl + "/crossEntry.png"
									})
							});
					}
				case wertyz.point.PointType.CROSSEXIT:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [13, 13],
										anchor: [0.5, 0.5],
										src: wertyz.map.settings.contentUrl + "/crossExit.png"
									})
							});
					}
				case wertyz.point.PointType.CROSSID:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [18, 22],
										anchor: [0.5, 1.0],
										src: wertyz.map.settings.contentUrl + "/trafficLight18x22.png"
									})
							});
					}
				case wertyz.point.PointType.CROSSPORT:
					{
						if (!wertyz.map.point.ol.crossportcanvas)
							wertyz.map.point.ol.crossportcanvas = document.createElement('canvas');
						let canvas = wertyz.map.point.ol.crossportcanvas;

						canvas.width = 18;
						canvas.height = 3;
						let ctx = canvas.getContext('2d');
						ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
						ctx.fillRect(0, 0, canvas.width, canvas.height);

						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										img: canvas,
										imgSize: [18, 3],
										anchor: [0.5, 8.5]
									})
							});
					}
				case wertyz.point.PointType.CROSSARM:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [14, 14],
										anchor: [0.5, 0.5],
										src: wertyz.map.settings.contentUrl + "/crossArm.png"
									})
							});
					}
				case wertyz.point.PointType.CROSSARM:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [14, 14],
										anchor: [0.5, 0.5],
										src: wertyz.map.settings.contentUrl + "/crossArm.png"
									})
							});
					}
				default:
					{
						return new ol.style.Style(
							{
								image: new ol.style.Circle(
									{
										radius: 4,
										fill: new ol.style.Fill(
											{
												color: "rgba(255, 255, 255, 1.0)"
											}),
										stroke: new ol.style.Stroke(
											{
												width: 1,
												color: "rgba(26, 107, 153, 0.6)"
											})
									})
							});
					}
			}
		},

		getStylesByCombinedPointTypes: function (feature, options)
		{//call this method only for stop by now
			let pointContentUrl = wertyz.map.settings.contentUrl + "/Point";
			let listTypeValues = feature.get("listTypeValues");
			let styles = [];

			if (options && options.view === "pis")
			{
				styles.push(new ol.style.Style(
					{
						image: new ol.style.Icon(
							{
								size: [60, 66],
								anchor: [0.4, 1.0],
								src: pointContentUrl + "/stopPis.png"
							})
					}));

				return styles;
			}

			if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
			{
				if (listTypeValues.containsType(wertyz.point.PointType.INFOTABLE))
				{
					let listTypeAdditionalValues = feature.get("listTypeAdditionalValues");
					let stateColor;

					if (listTypeAdditionalValues && listTypeAdditionalValues.getLength())
						stateColor = listTypeAdditionalValues.getType(wertyz.point.PointType.INFOTABLE).stateColor;

					if (options.isStartEndStop)
					{
						styles.push(new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [16, 29],
										anchor: [0.5, 1.0],
										src: pointContentUrl + "/stopStartEndInfoTable.png"
									})
							}));

						switch (stateColor)
						{
							case 1:
								styles.push(new ol.style.Style(
									{
										image: new ol.style.Icon(
											{
												size: [12, 22],
												anchor: [0.5, 1.0],
												src: wertyz.map.settings.contentUrl + "/noComRed.png"
											})
									}));
								break;
							case 2:
								styles.push(new ol.style.Style(
									{
										image: new ol.style.Icon(
											{
												size: [12, 22],
												anchor: [0.5, 1.0],
												src: wertyz.map.settings.contentUrl + "/noComOrange.png"
											})
									}));
								break;
						}
					}
					else
					{
						styles.push(new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [12, 22],
										anchor: [0.5, 1.0],
										src: pointContentUrl + "/stopInfoTable.png"
									})
							}));

						switch (stateColor)
						{
							case 1:
								styles.push(new ol.style.Style(
									{
										image: new ol.style.Icon(
											{
												size: [12, 22],
												anchor: [0.5, 1.0],
												src: wertyz.map.settings.contentUrl + "/noComRed.png"
											})
									}));
								break;
							case 2:
								styles.push(new ol.style.Style(
									{
										image: new ol.style.Icon(
											{
												size: [12, 22],
												anchor: [0.5, 1.0],
												src: wertyz.map.settings.contentUrl + "/noComOrange.png"
											})
									}));
								break;
						}
					}
				}
				else
				{
					if (options.isStartEndStop)
					{
						styles.push(new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [19, 28],
										anchor: [0.5, 1.0],
										src: pointContentUrl + "/stopStartEnd.png"
									})
							}));
					}
					else
					{
						styles.push(new ol.style.Style(
							{
								image: new ol.style.Icon(
									{
										size: [14, 22],
										anchor: [0.5, 1.0],
										src: pointContentUrl + "/stop.png"
									})
							}));
					}
				}
			}
			else
			{
				styles.push(wertyz.map.point.ol.getStyle(listTypeValues, options));
			}

			return styles;
		},

		getAllStyles: function (feature, options)
		{
			let listTypeValues = feature.get("listTypeValues");
			let styles = [];

			if (listTypeValues)
			{
				if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
				{
					styles = wertyz.map.point.ol.getStylesByCombinedPointTypes(feature, options);
					return styles;
				}
				else if (listTypeValues.containsType(wertyz.point.PointType.INFOTABLE))
				{
					let listTypeAdditionalValues = feature.get("listTypeAdditionalValues");
					let stateColor;

					if (listTypeAdditionalValues && listTypeAdditionalValues.getLength())
						stateColor = listTypeAdditionalValues.getType(wertyz.point.PointType.INFOTABLE).stateColor;

					let infoTableStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.INFOTABLE,
						{
							stateColor: stateColor
						});
					styles.push(infoTableStyle);
				}

				if (listTypeValues.containsType(wertyz.point.PointType.CROSSID))
				{
					let crossIdStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.CROSSID);
					styles.push(crossIdStyle);
				}

				if (listTypeValues.containsType(wertyz.point.PointType.CROSSPORT))
				{
					let crossPortStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.CROSSPORT);
					styles.push(crossPortStyle);
				}

				if (listTypeValues.containsType(wertyz.point.PointType.CROSSENTRY))
				{
					let crossEntryStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.CROSSENTRY);
					styles.push(crossEntryStyle);
				}

				if (listTypeValues.containsType(wertyz.point.PointType.CROSSEXIT))
				{
					let crossExitStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.CROSSEXIT);
					styles.push(crossExitStyle);
				}

				if (listTypeValues.containsType(wertyz.point.PointType.CROSSARM))
				{
					let crossArmStyle = wertyz.map.point.ol.getStyle(wertyz.point.PointType.CROSSARM);
					styles.push(crossArmStyle);
				}
			}

			if (!styles.length)
			{
				let defaultStyle = wertyz.map.point.ol.getStyle();
				styles.push(defaultStyle);
			}

			return styles;
		}
	},

	PointAction:
	{
		NONE: 0,
		ADD: 1,
		MOVE: 2,
		TYPE: 4,
		INVALIDATE: 8,
	},

	SegmentPointAction:
	{
		NONE: 0,
		ADD: 1,
		VALUES: 2,
		ORDER: 4,
		INVALIDATE: 8
	},

	Processor: function (mapExtender, points, options)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._features = [];
		this._hiddenFeatures = [];
		this._visibleFeatures = new ol.Collection();
		this._visibleStopPointFeatures = new ol.Collection();
		this._visibleSimplePointFeatures = new ol.Collection();
		this._newPointFeatures = new ol.Collection();
		this._stopPointLayer = null;
		this._simplePointLayer = null;
		this._newPointLayer = null;
		this._modifyInteraction = null;
		this._newPointDrawInteraction = null;
		this._filter = null;
		this._options = options || {};

		this._init = function (points)
		{
			if (points)
				self._createFeatures(points);

			let stopPointLayer = new ol.layer.Vector(
				{
					name: "StopPoints",
					source: new ol.source.Vector(
						{
							features: self._visibleStopPointFeatures
						}),
					style: self._styleGenerator.getStyle
				});
			self._stopPointLayer = stopPointLayer;

			let simplePointLayer = new ol.layer.Vector(
				{
					name: "SimplePoints",
					source: new ol.source.Vector(
						{
							features: self._visibleSimplePointFeatures
						}),
					style: self._styleGenerator.getStyle
				});
			self._simplePointLayer = simplePointLayer;

			let modifyInteraction = new ol.interaction.Modify(
				{
					features: self._visibleFeatures,
					style: self._styleGenerator.getModifyInteractionStyle
				});
			self._modifyInteraction = modifyInteraction;
			self._modifyInteraction.setActive(false);

			modifyInteraction.on("modifyend", function (event)
			{
				if (event.mapBrowserEvent.type !== "pointerup")
					return;

				let feature = self._visibleFeatures.getArray().find(function (ft)
				{
					return ft.get("pointAction") !== wertyz.map.point.PointAction.NONE;
				});

				if (!feature)
					return;

				let cord = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
				feature.set("latitude", cord[1]);
				feature.set("longitude", cord[0]);
			});

			//#region New Point

			let newPointVectorSource = new ol.source.Vector(
				{
					features: self._newPointFeatures
				});

			let newPointLayer = new ol.layer.Vector({
				source: newPointVectorSource,
				style: self._styleGenerator.getStyle
			});
			self._newPointLayer = newPointLayer;

			let newPointDrawInteraction = new ol.interaction.Draw(
				{
					source: newPointVectorSource,
					type: "Point",
					style: self._styleGenerator.getDrawStyle
				});

			newPointDrawInteraction.on("drawstart", function (event)
			{

			});
			newPointDrawInteraction.on("drawend", function (event)
			{
				let coordinates = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

				event.feature.set("latitude", wertyz.helper.toFixedFloat(coordinates[0], 5));
				event.feature.set("longitude", wertyz.helper.toFixedFloat(coordinates[1], 5));
				event.feature.set("originalListTypeValues", new wertyz.point.ListTypeArray());
				event.feature.set("listTypeValues", new wertyz.point.ListTypeArray());
				event.feature.set("pointAction", wertyz.map.point.PointAction.ADD);
				event.feature.set("parentProcessor", self);
				event.feature.set("type", "point");

				self._addFeatureChangeHandler(event.feature);
			});

			let newPointModifyInteraction = new ol.interaction.Modify(
				{
					features: self._newPointFeatures,
					style: self._styleGenerator.getModifyInteractionStyle
				});

			self._newPointDrawInteraction = newPointDrawInteraction;
			newPointDrawInteraction.setActive(false);

			//#endregion                        

			self._map.addLayer(simplePointLayer);
			self._map.addLayer(stopPointLayer);
			self._map.addLayer(newPointLayer);
			self._map.addInteraction(modifyInteraction);
			self._map.addInteraction(newPointDrawInteraction);
			self._map.addInteraction(newPointModifyInteraction);
		};

		this._styleGenerator = new function ()
		{
			this.getStyle = function (feature)
			{
				let styles = wertyz.map.point.ol.getAllStyles(feature,
					{
						zoom: self._map.getView().getZoom(),
						view: self._options.view
					});

				return styles;
			};

			this.getModifyInteractionStyle = function (feature)
			{
				let style = new ol.style.Style(
					{
						image: new ol.style.Circle(
							{
								stroke: new ol.style.Stroke(
									{
										color: "rgba(255,255,255,0.6)",
										width: 14
									}),
								radius: 12
							})
					});

				return style;
			};

			this.getDrawStyle = function (feature)
			{
				let style = new ol.style.Style(
					{
						image: new ol.style.RegularShape({
							fill: new ol.style.Fill({
								color: '#ffcc33'
							}),
							stroke: new ol.style.Stroke({
								color: '#000',
								width: 1
							}),
							points: 4,
							radius: 10,
							radius2: 0,
							angle: 0
						})
					});

				return style;
			}
		};

		this._getFeatureOptions = function (point)
		{
			let featureOptions =
			{
				pointId: point.id,
				latitude: point.latitude,
				longitude: point.longitude,
				altitude: point.altitude,
				pointAction: wertyz.map.point.PointAction.NONE,
				parentProcessor: self,
				type: "point",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([point.longitude, point.latitude]))
			};

			featureOptions.listTypeValues = wertyz.point.createListTypeArray(point);
			featureOptions.originalListTypeValues = wertyz.point.createListTypeArray(point);
			featureOptions.listTypeAdditionalValues = wertyz.point.createAdditionalListTypeArray(point);

			return featureOptions;
		};

		this._createFeatures = function (points)
		{
			self.clear();

			let options = [];
			let j;

			for (j = 0; j < points.length; j++)
			{
				let point = points[j];
				if (!point.longitude || !point.latitude)
					continue;

				//ol.Feature konštruktor si vnútorne pamätá kedy sa vytváral a potom
				//to v takom poradí aj renderuje bez ohľadu na to v akom poradí je to v poli
				//preto najskôr do opt a až potom vytváranie new ol.Feature(opt[j]);
				let opt = self._getFeatureOptions(point);

				if (opt.listTypeValues.containsType(wertyz.point.PointType.STOPID))
					options.push(opt);
				else
					options.unshift(opt);
			}
			for (j = 0; j < options.length; j++)
			{
				let feature = new ol.Feature(options[j]);
				let listTypeValues = feature.get("listTypeValues");

				self._addFeatureChangeHandler(feature);
				self._features.push(feature);

				if (self._filter)
				{
					let passed = self._testByFilter(vehicle, self._filter);
					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}
				}

				if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
					self._visibleStopPointFeatures.push(feature);
				else
					self._visibleSimplePointFeatures.push(feature);
				self._visibleFeatures.push(feature);
			}
		};

		this._filterFeatures = function (pointType, filter)
		{
			self._hiddenFeatures = [];
			self._visibleFeatures.clear();
			self._visibleStopPointFeatures.clear();
			self._visibleSimplePointFeatures.clear();

			for (let i = 0; i < self._features.length; i++)
			{
				let feature = self._features[i];
				let listTypeValues = feature.get("listTypeValues");

				if (filter)
				{
					let passed = false;

					for (let j = 0; j < listTypeValues.getLength(); j++)
					{
						let value = listTypeValues.getAt(j).value;

						if (value)
						{
							value = wertyz.helper.removeDiacritic(value).toLowerCase();
							passed = passed || value.indexOf(filter) > -1;
						}
					}

					if (!passed)
					{
						self._hiddenFeatures.push(feature);
						continue;
					}

					//let stopIdType = listTypeValues.getType(wertyz.point.PointType.STOPID);
					//let stopNameType = listTypeValues.getType(wertyz.point.PointType.STOPNAME);
					//let infotableType = listTypeValues.getType(wertyz.point.PointType.INFOTABLE);                

					//if ((pointType === wertyz.point.PointType.STOPID && stopIdType)
					//   || (pointType === wertyz.point.PointType.INFOTABLE && infotableType))
					//{
					//   let stopId = wertyz.helper.removeDiacritic(stopIdType.value.toString()).toLowerCase();
					//   let stopName = wertyz.helper.removeDiacritic(stopNameType.value.toString()).toLowerCase();
					//   let passed = stopId.indexOf(filter) > -1 || stopName.indexOf(filter) > -1;

					//   if (pointType === wertyz.point.PointType.INFOTABLE
					//      && infotableType)
					//   {
					//      let ip = wertyz.helper.removeDiacritic(infotableType.value.toString()).toLowerCase();
					//      passed = passed && ip.indexOf(filter) > -1;
					//   }

					//   if (!passed)
					//   {
					//      self._hiddenFeatures.push(feature);
					//      continue;
					//   }
					//}
				}

				if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
					self._visibleStopPointFeatures.push(feature);
				else
					self._visibleSimplePointFeatures.push(feature);
				self._visibleFeatures.push(feature);
			}
		};

		this._addFeatureChangeHandler = function (feature)
		{
			feature.on("change", function (event)
			{
				//console.log("zmena");

				let coordinates = ol.proj.transform(event.target.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
				let oldLatitude = event.target.get("latitude");
				let oldLongitude = event.target.get("longitude");
				let newLatitude = wertyz.helper.toFixedFloat(coordinates[1], 5);
				let newLongitude = wertyz.helper.toFixedFloat(coordinates[0], 5);

				if (newLatitude === oldLatitude && newLongitude === oldLongitude)
					return;

				event.target.set("latitude", newLatitude);
				event.target.set("longitude", newLongitude);

				let action = event.target.get("pointAction");
				if ((newLatitude !== oldLatitude || newLongitude !== oldLongitude)
					&& action !== wertyz.map.point.PointAction.ADD)
					event.target.set("pointAction", action | wertyz.map.point.PointAction.MOVE);

				self.event.call("featuregeometrychange", event.target);
			}, feature);
		};

		this._getPointForSave = function (feature)
		{
			let action = feature.get("pointAction");
			if (action === wertyz.map.point.PointAction.NONE)
				return;

			let listTypeValues = feature.get("listTypeValues");
			let newListTypeValues = listTypeValues.getArray().slice();
			let listTypeValue;
			let originalTypeValue;
			let point = {};
			let syncId = 1;
			let i;

			if (!(action & wertyz.map.point.PointAction.ADD))
			{
				point.pointId = feature.get("pointId");
			}

			if (action & wertyz.map.point.PointAction.ADD
				|| action & wertyz.map.point.PointAction.MOVE)
			{
				if (action & wertyz.map.point.PointAction.ADD)
				{
					point.syncId = syncId;
					feature.set("syncId", syncId, false);
					//syncId++;
				}

				point.latitude = feature.get("latitude");
				point.longitude = feature.get("longitude");
			}

			if (action & wertyz.map.point.PointAction.TYPE)
			{
				let originalListTypeValues = feature.get("originalListTypeValues");
				i = listTypeValues.getLength();

				while (i--)
				{
					listTypeValue = listTypeValues.getAt(i);
					originalTypeValue = originalListTypeValues.getType(listTypeValue.listTypeId);

					if (originalTypeValue && originalTypeValue.value === listTypeValue.value)
						newListTypeValues.splice(i, 1);
				}

				for (i = 0; i < originalListTypeValues.getLength(); i++)
				{
					listTypeValue = listTypeValues.getType(originalTypeValue.listTypeId);
					originalTypeValue = originalListTypeValues.getAt(i);

					if (!listTypeValue)
						newListTypeValues.push({ listTypeId: originalTypeValue.listTypeId });
				}
			}

			if (action & wertyz.map.point.PointAction.TYPE ||
				(action & wertyz.map.point.PointAction.ADD && newListTypeValues.length))
			{
				for (i = 0; i < newListTypeValues.length; i++)
				{
					listTypeValue = newListTypeValues[i];

					if (!listTypeValue.value)
						delete listTypeValue.value;
					delete listTypeValue.valueId;
				}

				if (newListTypeValues.length)
					point.listTypeValues = newListTypeValues;
			}

			if (!Object.keys(point).length)
				return;
			return point;
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			let extent1 = self._stopPointLayer.getSource().getExtent();
			let extent2 = self._simplePointLayer.getSource().getExtent();
			let extent = ol.extent.extend(extent1, extent2);

			return extent;
		};

		this.fitMap = function (options)
		{
			let view = self._map.getView();

			if (!self._visibleFeatures.getLength())
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			let maxZoom = options
				? (options.maxZoom || wertyz.map.settings.maxFitZoom)
				: wertyz.map.settings.maxFitZoom;
			let padding = options
				? (options.padding || [0, 0, 0, 0])
				: [0, 0, 0, 0];

			view.fit(extent, { maxZoom: maxZoom, padding: padding });
		};

		this.refresh = function (points)
		{
			self.clear();
			self._createFeatures(points);
			self.event.call("refresh");
		};

		this.clear = function ()
		{
			self._features = [];
			self._hiddenFeatures = [];
			self._visibleFeatures.clear();
			self._visibleStopPointFeatures.clear();
			self._visibleSimplePointFeatures.clear();
		};

		this.save = function (feature)
		{
			let point = self._getPointForSave(feature);
			if (!point)
				return true;

			let data = { data: JSON.stringify([point]) };

			console.log(data);

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.savePointsUrl,
					data: data
				})
				.done(function (data)
				{
					if (!data || !data.state)
					{
						alert("Save points - No data in ajax response!");
						return;
					}

					if (data.state === wertyz.map.ajax.resultState.ERROR)
					{
						alert("Save points error: " + data.info);
						return;
					}

					if (!data.data || !data.data.length)
					{
						alert("Save points result: No data!");
						return;
					}

					let resultPoints = data.data;

					resultPoints.forEach(function (resultPoint)
					{
						let feature;
						let listTypeValues;

						if (resultPoint.syncId)
						{
							feature = self._newPointFeatures.getArray().find(function (ft)
							{
								return ft.get("syncId") === resultPoint.syncId;
							});
							feature.set("pointId", resultPoint.pointId);

							self._newPointFeatures.remove(feature);
							self._features.push(feature);
							self._visibleFeatures.push(feature);

							listTypeValues = feature.get("listTypeValues");
							if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
								self._visibleStopPointFeatures.push(feature);
							else
								self._visibleSimplePointFeatures.push(feature);
						}
						else
						{
							feature = self._features.find(function (ft)
							{
								return ft.get("pointId") === resultPoint.pointId;
							});

							if (feature.get("pointAction") === wertyz.map.point.PointAction.INVALIDATE)
							{
								let indexOfHidden = self._hiddenFeatures.indexOf(feature);
								if (indexOfHidden > -1)
								{
									self._hiddenFeatures.splice(indexOfHidden, 1);
									return;
								}

								listTypeValues = feature.get("listTypeValues");
								if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
									self._visibleStopPointFeatures.remove(feature);
								else
									self._visibleSimplePointFeatures.remove(feature);
								self._visibleFeatures.remove(feature);
								//TODO čo ak je medzitým hidden
								return;
							}
						}

						let pointAction = feature.get("pointAction");
						if (pointAction & wertyz.map.point.PointAction.TYPE)
						{
							let originalListTypeValues = feature.get("originalListTypeValues");
							let newOriginalListTypeValuesArray = feature.get("listTypeValues").getArray().slice();

							originalListTypeValues.setArray(newOriginalListTypeValuesArray);
						}

						feature.set("pointAction", wertyz.map.point.PointAction.NONE);
					});

					alert("Save points - Ok!");
				})
				.fail(function (error)
				{
					alert("Save points - Error: " + errorThrown);
				})
				.always(function ()
				{
					//force syncId delete
					self._newPointFeatures.forEach(function (feature)
					{
						if (!feature.get("syncId"))
							return;

						feature.set("syncId", null, false);
					});
				});
		};

		this.removePointFeature = function (feature, onDone)
		{
			let pointId = feature.get("pointId");

			if (isNaN(pointId))
			{
				self._newPointFeatures.remove(feature);

				if (onDone)
					onDone();

				return;
			}

			let data = { data: JSON.stringify([{ pointId: pointId }]) };

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.savePointsUrl,
					data: data
				})
				.done(function (data)
				{
					if (!data || !data.data || data.data !== "ok")
					{
						alert("Delete point - No data in ajax response!");
						return;
					}
					if (data.data !== "ok")
					{
						alert("Delete point - Rejected: " + data.data);
						return;
					}

					let listTypeValues = feature.get("listTypeValues");

					if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
						self._visibleStopPointFeatures.remove(feature);
					else
						self._visibleSimplePointFeatures.remove(feature);
					self._visibleFeatures.remove(feature);
					//TODO mazať zo všetkých aj skrytých kolekcíí, aj keď tam by teoreticky nemal byť bod, ktorý je užívateľom mazaný               

					if (onDone)
						onDone();

					alert("Delete point - Ok!");
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					alert("Delete point - Error: " + errorThrown);
				});
		};

		this.setModifyActive = function (value)
		{
			self._modifyInteraction.setActive(value);
		};

		this.getDrawActive = function ()
		{
			return self._newPointDrawInteraction.getActive();
		};

		this.setDrawActive = function (value)
		{
			//self._clear();
			self._newPointDrawInteraction.setActive(value);
		};

		this.setFilter = function (pointType, filter, optSilent)
		{
			self._filter = filter;

			if (optSilent)
				return;

			self._filterFeatures(pointType, filter);

			if (self._visibleFeatures.getLength() === 1)
				self._mapExtender.centerPan(self._visibleFeatures.item(0));
		};

		this._init(points);
	},

	PlatformProcessor: function (mapExtender, platforms, options)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._features = [];
		this._visibleFeatures = new ol.Collection();
		this._visiblePointFeatures = new ol.Collection();
		this._visibleGeometryFeatures = new ol.Collection();
		this._newPointFeatures = new ol.Collection();
		this._pointLayer = null;
		this._geometryLayer = null;
		this._newPointLayer = null;
		this._newPointDrawInteraction = null;
		this._filter = null;

		this._init = function (platforms, options)
		{
			if (platforms)
				self._createFeatures(platforms);

			let pointLayer = new ol.layer.Vector(
				{
					name: "Points",
					source: new ol.source.Vector(
						{
							features: self._visiblePointFeatures
						}),
					style: self._styleGenerator.getStyle
				});
			self._pointLayer = pointLayer;

			let geometryLayer = new ol.layer.Vector(
				{
					name: "Geometries",
					source: new ol.source.Vector(
						{
							features: self._visibleGeometryFeatures
						}),
					style: self._styleGenerator.getStyle
				});
			self._geometryLayer = geometryLayer;

			let modifyInteraction = new ol.interaction.Modify(
				{
					features: self._visiblePointFeatures,
					style: self._styleGenerator.getModifyInteractionStyle
				});

			modifyInteraction.on("modifyend", function (event)
			{
				if (event.mapBrowserEvent.type !== "pointerup")
					return;

				let features = self._visibleFeatures.getArray().filter(function (feature)
				{
					return feature.get("pointAction") !== wertyz.map.point.PointAction.NONE;
				});

				if (!features.length)
					return;

				self.save(features);
			});

			if (!options || options.allowEdit !== true)
				modifyInteraction.setActive(false);

			//#region New Point

			let newPointVectorSource = new ol.source.Vector(
				{
					features: self._newPointFeatures
				});

			let newPointLayer = new ol.layer.Vector({
				source: newPointVectorSource,
				style: self._styleGenerator.getStyle
			});
			self._newPointLayer = newPointLayer;

			let newPointDrawInteraction = new ol.interaction.Draw(
				{
					source: newPointVectorSource,
					type: "Point",
					style: self._styleGenerator.getDrawStyle
				});

			newPointDrawInteraction.on("drawstart", function (event)
			{

			});
			newPointDrawInteraction.on("drawend", function (event)
			{
				let coordinates = ol.proj.transform(event.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

				event.feature.set("latitude", wertyz.helper.toFixedFloat(coordinates[0], 5));
				event.feature.set("longitude", wertyz.helper.toFixedFloat(coordinates[1], 5));
				event.feature.set("originalListTypeValues", new wertyz.point.ListTypeArray());
				event.feature.set("listTypeValues", new wertyz.point.ListTypeArray());
				event.feature.set("pointAction", wertyz.map.point.PointAction.ADD);
				event.feature.set("parentProcessor", self);
				event.feature.set("type", "point");

				self._addFeatureChangeHandler(event.feature);
			});

			let newPointModifyInteraction = new ol.interaction.Modify(
				{
					features: self._newPointFeatures,
					style: self._styleGenerator.getModifyInteractionStyle
				});

			self._newPointDrawInteraction = newPointDrawInteraction;
			newPointDrawInteraction.setActive(false);

			//#endregion                        

			self._map.addLayer(pointLayer);
			self._map.addLayer(geometryLayer);
			self._map.addLayer(newPointLayer);
			self._map.addInteraction(modifyInteraction);
			self._map.addInteraction(newPointDrawInteraction);
			self._map.addInteraction(newPointModifyInteraction);
		};

		this._styleGenerator = new function ()
		{
			this.getStyle = function (feature)
			{
				let platformNumber = feature.get("number");

				if (wertyz.helper.isNumber(platformNumber))
				{
					let style = new ol.style.Style(
						{
							image: new ol.style.Icon(
								{
									size: [18, 29],
									anchor: [0.5, 1.0],
									src: wertyz.map.settings.contentUrl + "/busstop38.png"
								}),
							text: new ol.style.Text(
								{
									font: "bold 10px sans-serif",
									text: platformNumber.toString(),
									fill: new ol.style.Fill(
										{
											color: "#fff"
										}),
									offsetX: 0,
									offsetY: -19
								})
						});

					return style;
				}
				else
				{
					let style = new ol.style.Style(
						{
							fill: new ol.style.Fill(
								{
									color: "rgba(0, 152, 153, 0.2)"
								})
						});

					return style;
				}
			};

			this.getModifyInteractionStyle = function (feature)
			{
				// let style = new ol.style.Style(
				// {
				//       image: new ol.style.RegularShape({
				//       fill: new ol.style.Fill({
				//             color: '#ffcc33'
				//       }),
				//       stroke: new ol.style.Stroke({
				//             color: '#000',
				//             width: 1
				//       }),
				//       points: 4,
				//       radius: 10,
				//       radius2: 0,
				//       angle: 0
				//       })
				// });

				// return style;
			};

			this.getDrawStyle = function (feature)
			{
				let style = new ol.style.Style(
					{
						image: new ol.style.RegularShape({
							fill: new ol.style.Fill({
								color: '#ffcc33'
							}),
							stroke: new ol.style.Stroke({
								color: '#000',
								width: 1
							}),
							points: 4,
							radius: 10,
							radius2: 0,
							angle: 0
						})
					});

				return style;
			}
		};

		this._getFeatureOptions = function (platform)
		{
			let featureOptions =
			{
				pointId: platform.pointid,
				platformId: platform.platformid,
				number: platform.number,
				latitude: platform.latitude,
				longitude: platform.longitude,
				altitude: platform.altitude,
				pointAction: wertyz.map.point.PointAction.NONE,
				parentProcessor: self,
				type: "point",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([platform.longitude, platform.latitude])),

				//TODO
				originalListTypeValues: new wertyz.point.ListTypeArray(),
				listTypeValues: new wertyz.point.ListTypeArray()
			};

			return featureOptions;
		};

		this._createFeatures = function (platforms)
		{
			self.clear();

			let options = [];

			for (let j = 0; j < platforms.length; j++)
			{
				let platform = platforms[j];

				//ol.Feature konštruktor si vnútorne pamätá kedy sa vytváral a potom
				//to v takom poradí aj renderuje bez ohľadu na to v akom poradí je to v poli
				//preto najskôr do opt a až potom vytváranie new ol.Feature(opt[j]);
				let opt = self._getFeatureOptions(platform);

				if (opt.listTypeValues.containsType(wertyz.point.PointType.STOPID))
					options.push(opt);
				else
					options.unshift(opt);
			}
			for (let j = 0; j < platforms.length; j++)
			{
				let feature = new ol.Feature(options[j]);
				let listTypeValues = feature.get("listTypeValues");

				self._addFeatureChangeHandler(feature);
				self._features.push(feature);
				self._visiblePointFeatures.push(feature);
				self._visibleFeatures.push(feature);
			}

			let feature = self._getSmallestEnclosingCircle(self._visiblePointFeatures);

			self._features.push(feature);
			self._visibleFeatures.push(feature);
			self._visibleGeometryFeatures.push(feature);

		};

		this._addFeatureChangeHandler = function (feature)
		{
			feature.on("change", function (event)
			{
				let coordinates = ol.proj.transform(event.target.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
				let oldLatitude = event.target.get("latitude");
				let oldLongitude = event.target.get("longitude");
				let newLatitude = wertyz.helper.toFixedFloat(coordinates[1], 5);
				let newLongitude = wertyz.helper.toFixedFloat(coordinates[0], 5);

				if (newLatitude === oldLatitude && newLongitude === oldLongitude)
					return;

				event.target.set("latitude", newLatitude);
				event.target.set("longitude", newLongitude);

				let action = event.target.get("pointAction");
				if (action !== wertyz.map.point.PointAction.ADD)
					event.target.set("pointAction", action | wertyz.map.point.PointAction.MOVE);

				//Set circle parameters                           
				let circleFeature = self._visibleGeometryFeatures.item(0);//TODO moze byt viac, treba dat referenciu na featuru
				self._updateSmallestEnclosingCircle(circleFeature, self._visiblePointFeatures);

				self.event.call("featuregeometrychange", event.target);
			}, feature);
		};

		this._getPointForSave = function (feature)
		{
			let point = {};

			point.platformid = feature.get("platformId");
			point.longitude = feature.get("longitude") * 100000;
			point.latitude = feature.get("latitude") * 100000;

			return point;
		};

		this._getSmallestEnclosingCircleDefinition = function (features)
		{
			let points = [];

			features.forEach((spf, index) =>
			{
				points.push(
					{
						x: spf.get("longitude"),
						y: spf.get("latitude")
					});
			});

			let circleDef = wertyz.gps.smallestEnclosingCircle.makeCircle(points);

			circleDef.r = circleDef.r * 200000;//TODO sofistikovanejsie

			return circleDef;
		};

		this._getSmallestEnclosingCircle = function (features)
		{
			let circleDef = self._getSmallestEnclosingCircleDefinition(features);
			let center = ol.proj.transform([circleDef.x, circleDef.y], "EPSG:4326", "EPSG:3857");
			let radius = Math.max(circleDef.r, 50);
			let circle = new ol.geom.Circle(center, radius);
			let feature = new ol.Feature(circle);

			return feature;
		};

		this._updateSmallestEnclosingCircle = function (circleFeature, features)
		{
			let circleDef = self._getSmallestEnclosingCircleDefinition(features);
			let center = ol.proj.transform([circleDef.x, circleDef.y], "EPSG:4326", "EPSG:3857");
			let radius = Math.max(circleDef.r, 50);

			circleFeature.getGeometry().setCenterAndRadius(center, radius);
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.getVisibleFeatures = function ()
		{
			return self._visibleFeatures;
		};

		this.getFeature = function (platformId)
		{
			let feature = self._features.find((f) => 
			{
				return f.get("platformId") === platformId;
			});

			return feature;
		};

		this.getFilter = function ()
		{
			return self._filter;
		};

		this.getExtent = function ()
		{
			let extent1 = self._pointLayer.getSource().getExtent();
			let extent2 = self._geometryLayer.getSource().getExtent();
			let extent = ol.extent.extend(extent1, extent2);

			return extent;
		};

		this.setPlatformLonLat = function (platformId, longitude, latitude)
		{
			let feature = self.getFeature(platformId);

			feature.getGeometry().setCoordinates(ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857'));
			feature.set("longitude", longitude);
			feature.set("latitude", latitude);
		};

		this.fitMap = function (options)
		{
			let view = self._map.getView();

			if (!self._visibleFeatures.getLength())
			{
				view.setCenter(ol.proj.fromLonLat([0, 0]));
				view.setZoom(2);
				return;
			}

			let extent = self.getExtent();
			view.fit(extent, options);
		};

		this.refresh = function (platforms)
		{
			self.clear();
			self._createFeatures(platforms);
		};

		this.clear = function ()
		{
			self._features = [];
			self._visibleFeatures.clear();
			self._visiblePointFeatures.clear();
			self._visibleGeometryFeatures.clear();
		};

		this.save = function (features)
		{
			let point = self._getPointForSave(features[0]); //TODO save all not only first?
			let data = point;

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.editPlatformUrl,
					//contentType: "application/json",
					data: data
				})
				.done(function (data)
				{
					if (!data || data.success === undefined)
					{
						console.log("Save platform - No data in ajax response!");
						return;
					}

					if (data.success !== true)
					{
						console.log("Save platform error: " + data.info);
						return;
					}

					console.log("Save platform - Ok!");
				})
				.fail(function (error)
				{
					alert("Save platform - Error: " + errorThrown);
				})
				.always(function ()
				{
				});
		};

		this.removePointFeature = function (feature, onDone)
		{
			let pointId = feature.get("pointId");

			if (isNaN(pointId))
			{
				self._newPointFeatures.remove(feature);

				if (onDone)
					onDone();

				return;
			}

			let data = { data: JSON.stringify([{ pointId: pointId }]) };

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.savePointsUrl,
					data: data
				})
				.done(function (data)
				{
					if (!data || !data.data || data.data !== "ok")
					{
						alert("Delete point - No data in ajax response!");
						return;
					}
					if (data.data !== "ok")
					{
						alert("Delete point - Rejected: " + data.data);
						return;
					}

					let listTypeValues = feature.get("listTypeValues");

					if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
						self._visiblePointFeatures.remove(feature);
					else
						self._visibleGeometryFeatures.remove(feature);
					self._visibleFeatures.remove(feature);
					//TODO mazať zo všetkých aj skrytých kolekcíí, aj keď tam by teoreticky nemal byť bod, ktorý je užívateľom mazaný               

					if (onDone)
						onDone();

					alert("Delete point - Ok!");
				})
				.fail(function (jqXHR, textStatus, errorThrown)
				{
					alert("Delete point - Error: " + errorThrown);
				});
		};

		this.getDrawActive = function ()
		{
			return self._newPointDrawInteraction.getActive();
		};

		this.setDrawActive = function (value)
		{
			//self._clear();
			self._newPointDrawInteraction.setActive(value);
		};

		this._init(platforms, options);
	},

	PinProcessor: function (mapExtender, point)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._features = new ol.Collection();
		this._layer = null;

		this._init = function (points)
		{
			self._createFeatures(point);

			let layer = new ol.layer.Vector(
				{
					name: "PinPoint",
					source: new ol.source.Vector(
						{
							features: self._features
						}),
					zIndex: 9,
					style: self._styleGenerator.getStyle
				});
			self._layer = layer;

			let modifyInteraction = new ol.interaction.Modify(
				{
					features: self._features,
					style: self._styleGenerator.getModifyInteractionStyle
				});

			self._map.addLayer(layer);
			self._map.addInteraction(modifyInteraction);
		};

		this._styleGenerator = new function ()
		{
			this.getStyle = function (feature)
			{
				let style = new ol.style.Style(
					{
						image: new ol.style.Icon(
							{
								size: [46, 66],
								anchor: [0.5, 1.0],
								src: wertyz.map.settings.contentUrl + "/pinPoint.png"
							})
					});

				return style;
			};

			this.getModifyInteractionStyle = function (feature)
			{
				let style = new ol.style.Style(
					{
						image: new ol.style.Icon(
							{
								size: [46, 66],
								anchor: [0.5, 1.0],
								src: wertyz.map.settings.contentUrl + "/pinPoint.png"
							})
					});

				return style;
			};
		};

		this._getFeatureOptions = function (point)
		{
			let featureOptions =
			{
				latitude: point.latitude,
				longitude: point.longitude,
				parentProcessor: self,
				type: "point",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([point.longitude, point.latitude]))
			};

			return featureOptions;
		};

		this._createFeatures = function (point)
		{
			let options = self._getFeatureOptions(point);
			let feature = new ol.Feature(options);

			self._addFeatureChangeHandler(feature);
			self._features.push(feature);
		};

		this._addFeatureChangeHandler = function (feature)
		{
			feature.on("change", function ()
			{
				let coordinates = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
				coordinates = [coordinates[1], coordinates[0]];
				feature.set("latitude", coordinates[0]);
				feature.set("longitude", coordinates[1]);
				self.event.call("coordinateschange", coordinates);
			});
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

wertyz.map.route =
{
	ol:
	{
		getStyle: function (feature)
		{
			let width = 5;
			let color = "rgba(0, 179, 253, 1.0)";
			//if (feature.get("type") === "borderroute")
			//{
			//   width = 8;
			//   color = "rgba(0, 123, 175, 1.0)";
			//}

			return new ol.style.Style(
				{
					stroke: new ol.style.Stroke(
						{
							width: width,
							color: color
						})
				});
		},

		getNewSegmentPointStyle: function ()
		{
			return new ol.style.Style(
				{
					// image: new ol.style.Circle(
					// {
					// 	radius: 4,
					// 	fill: new ol.style.Fill(
					// 	{
					// 		//color: "rgb(255, 255, 255)"
					// 		color: "rgb(255, 255, 0)"
					// 	}),
					// 	stroke: new ol.style.Stroke(
					// 	{
					// 		width: 2,
					// 		//color: "rgb(255, 128, 12)"
					// 		color: "rgb(0, 0, 0)"
					// 	})
					// })
					image: new ol.style.Circle(
						{
							radius: 6,
							// fill: new ol.style.Fill(
							// {
							// 	//color: "rgb(255, 255, 255)"
							// 	color: "rgb(255, 255, 0)"
							// }),
							stroke: new ol.style.Stroke(
								{
									width: 4,
									//color: "rgb(255, 128, 12)"
									color: "rgba(255, 0, 0, 0.4)"
								})
						})
				});
		}
	},

	Processor: function (mapExtender, routes, options)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._stopPointLayer = null;
		this._simplePointLayer = null;
		this._routeLayer = null;
		this._stopPointFeatures = new ol.Collection();
		this._simplePointFeatures = new ol.Collection();
		this._pointFeatures = new ol.Collection();
		this._routeFeatures = new ol.Collection();
		this._editMode = (options && options.editMode) || false;
		//this._routeHelperFeatures = new ol.Collection();
		this._modifyInteractions = [];
		this._modifiedPointHelper =
		{
			feature: null,
		};
		this._modifiedRouteHelper =
		{
			feature: null,
			originalCoordinates: null,
			isInProgress: false,
			set: function (feature)
			{
				self._modifiedRouteHelper.feature = feature;
				self._modifiedRouteHelper.originalCoordinates = feature.getGeometry().getCoordinates();
			},
			reset: function ()
			{
				self._modifiedRouteHelper.feature = null;
				self._modifiedRouteHelper.originalCoordinates = null;
				self._modifiedRouteHelper.isInProgress = false;
			}
		};

		this._init = function (routes)
		{
			self._createFeatures(routes);

			let stopPointLayer = new ol.layer.Vector(
				{
					name: "StopPoints",
					source: new ol.source.Vector(
						{
							features: self._stopPointFeatures
						}),
					zIndex: 4,
					style: self._styleGenerator.getPointStyle
				});
			self._stopPointLayer = stopPointLayer;

			let simplePointLayer = new ol.layer.Vector(
				{
					name: "SimplePoints",
					source: new ol.source.Vector(
						{
							features: self._simplePointFeatures
						}),
					zIndex: 3,
					style: self._styleGenerator.getPointStyle
				});
			self._simplePointLayer = simplePointLayer;

			if (!wertyz.map.settings.route.getShowPoints())
				simplePointLayer.setVisible(false);

			let routeLayer = new ol.layer.Vector(
				{
					name: "PlanRoutes",
					source: new ol.source.Vector(
						{
							features: self._routeFeatures
						}),
					zIndex: 2,
					style: self._styleGenerator.getRouteStyle
				});
			self._routeLayer = routeLayer;

			self._map.addLayer(routeLayer);
			self._map.addLayer(simplePointLayer);
			self._map.addLayer(stopPointLayer);

			self._map.getView().on("change:resolution", function (event)
			{
				self._setLayersByZoom();
			});

			let modifyInteractionPoints = new ol.interaction.Modify({
				features: self._simplePointFeatures,
				//condition: function (mapBrowserEvent)
				//{
				//   console.log(ol.events.condition.click(mapBrowserEvent));
				//   return ol.events.condition.primaryAction(mapBrowserEvent)
				//      && !ol.events.condition.singleClick(mapBrowserEvent);
				//},
				style: self._styleGenerator.getModifyInteractionPointStyle
			});

			modifyInteractionPoints.on("modifystart", function (event) { });

			modifyInteractionPoints.on("modifyend", function (event)
			{
				//hack for click and no drag
				if (self._modifiedPointHelper.feature === null)
					return;

				self._recomputeAfterFeatureAdded(self._modifiedPointHelper.feature);
				self._modifiedPointHelper.feature = null;
			});
			self._modifyInteractions.push(modifyInteractionPoints);

			let modifyInteractionRoutes = new ol.interaction.Modify(
				{
					deleteCondition: function (mapBrowserEvent)
					{
						return ol.events.condition.singleClick(mapBrowserEvent)
							&& ol.events.condition.shiftKeyOnly(mapBrowserEvent);
					},
					features: self._routeFeatures,
					style: self._styleGenerator.getModifyInteractionRouteStyle
				});

			modifyInteractionRoutes.on("modifystart", function (event)
			{
				self._modifiedRouteHelper.isInProgress = true;
			});
			modifyInteractionRoutes.on("modifyend", function (event)
			{
				let routeFeature = self._modifiedRouteHelper.feature;
				let coordinates = routeFeature.getGeometry().getCoordinates();

				for (let i = 0; i < coordinates.length; i++)
				{
					let segm = coordinates[i];

					if (segm[0] === self._modifiedRouteHelper.originalCoordinates[i][0] &&
						segm[1] === self._modifiedRouteHelper.originalCoordinates[i][1])
						continue;

					self.addPointFeature(i, segm[0], segm[1]);
					break;
				}
				self._setModifiedRouteHelper(routeFeature, false);
			});
			self._modifyInteractions.unshift(modifyInteractionRoutes);

			//Force interaction to take the point first when in conflict => added in reversed order         
			self._map.addInteraction(modifyInteractionRoutes);
			self._map.addInteraction(modifyInteractionPoints);

			if (!self._editMode)
				self._setModifyInteractionsActive(false);

			self._setLayersByZoom();
		};

		this._createFeatures = function (routes)
		{
			for (let i = 0; i < routes.length; i++)
			{
				let route = routes[i];
				let pointFeatures = [];
				let polygonArray = [];
				let options = [];
				let routeName;

				//let routeBorderFeature = new ol.Feature({                 
				//   type: "borderroute"
				//});
				let routeFeature = new ol.Feature({
					//geometry: lineString,
					routeNumber: route.number, //String!!!
					pointFeatures: pointFeatures,
					type: "route"
				});
				
				for (let j = 0; j < route.points.length; j++)
				{
					let segmentPoint = route.points[j];
					if (!segmentPoint.point.longitude || !segmentPoint.point.latitude)
						continue;

					//ol.Feature konštruktor si vnútorne pamätá kedy sa vytváral a potom
					//to v takom poradí aj renderuje bez ohľadu na to v akom poradí je to v poli
					//preto najskôr do opt a až potom vytváranie new ol.Feature(opt[j]);
					let opt = self._getFeatureOptions(segmentPoint);
					opt.routeFeature = routeFeature;

					if (opt.listTypeValues.containsType(wertyz.point.PointType.STOPID))
						options.push(opt);
					else
						options.unshift(opt);

					polygonArray.push(ol.proj.transform([segmentPoint.point.longitude, segmentPoint.point.latitude],
						"EPSG:4326",
						"EPSG:3857"));

					if (j === 0)
					{
						routeName = route.number.substring(0, route.number.length - 3);

						let stopNameTypeFirst = opt.listTypeValues.getType(wertyz.point.PointType.STOPNAME);
						if (stopNameTypeFirst)
							routeName += "\r\n\r\n" + stopNameTypeFirst.value;
					}
					else if (j === route.points.length - 1)
					{
						let stopNameTypeLast = opt.listTypeValues.getType(wertyz.point.PointType.STOPNAME);
						if (stopNameTypeLast)
							routeName += " - " + stopNameTypeLast.value;
					}
				}

				routeFeature.set("routeName", routeName);


				for (let j = 0; j < options.length; j++)
				{
					let feature = new ol.Feature(options[j]);
					let listTypeValues = feature.get("listTypeValues");

					self._addFeatureChangeGeometryHandler(feature);
					if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
						self._stopPointFeatures.push(feature);
					else
						self._simplePointFeatures.push(feature);
					self._pointFeatures.push(feature);
					pointFeatures.push(feature);
				}

				//sort by order on route
				pointFeatures.sort((f1, f2) => 
				{
					return f1.get("orderOnRoute") - f2.get("orderOnRoute");
				});

				//Route
				let lineString = new ol.geom.LineString(polygonArray);
				//routeBorderFeature.setGeometry(lineString);              
				routeFeature.setGeometry(lineString);

				routeFeature.on("change", function (event)
				{
					if (!self._modifiedRouteHelper.isInProgress || self._modifiedRouteHelper.feature)
						return;

					self._setModifiedRouteHelper(event.target, true);
				});

				//self._routeHelperFeatures.push(routeBorderFeature);
				self._routeFeatures.push(routeFeature);
			}
		};

		this._styleGenerator = new function ()
		{
			this.getPointStyle = function (feature)
			{
				//TODO inak
				let visible = feature.get("visible");
				if (visible === false)
					return null;

				let segmentPointId = feature.get("segmentPointId");
				let styles = [];

				styles = wertyz.map.point.ol.getAllStyles(feature,
					{
						zoom: self._map.getView().getZoom(),
						isStartEndStop: self._isStartEndPoint(feature)
					});

				if (!segmentPointId)
				{//added point				
					let newSegmentPointStyle = wertyz.map.route.ol.getNewSegmentPointStyle();
					styles.push(newSegmentPointStyle);
				}

				// if (!segmentPointId)
				// {//added point				
				// 	let newSegmentPointStyle = wertyz.map.route.ol.getNewSegmentPointStyle();
				// 	styles.push(newSegmentPointStyle);
				// }
				// else
				// {
				// 	styles = wertyz.map.point.ol.getAllStyles(feature,
				// 	{
				// 		zoom: self._map.getView().getZoom(),
				// 		isStartEndStop: self._isStartEndPoint(feature)
				// 	});
				// }				

				return styles;
			},

				this.getRouteStyle = function (routeFeature)
				{
					//TODO inak
					let visible = routeFeature.get("visible");
					if (visible === false)
						return null;

					return wertyz.map.route.ol.getStyle(routeFeature);
				},

				this.getModifyInteractionPointStyle = function ()
				{
				};

			this.getModifyInteractionRouteStyle = function ()
			{
				let styles =
					[
						//wertyz.map.point.ol.getStyle(),                  
						new ol.style.Style(
							{
								image: new ol.style.Circle(
									{
										stroke: new ol.style.Stroke(
											{
												color: "rgba(0, 0, 0, 0.3)",
												width: 5
											}),
										radius: 6
									})
							})
					];

				return styles;
			};
		};

		this._isStartEndPoint = function (feature)
		{
			let routeFeature = feature.get("routeFeature");
			let firstFeature = self.getPointFeature(routeFeature, 1);

			if (feature === firstFeature)
				return true;

			let lastFeature = self.getLastPointFeature(routeFeature);

			if (feature === lastFeature)
				return true;

			return false;
		}

		this._getFeatureOptions = function (segmentPoint)
		{
			let featureOptions =
			{
				//TODO prifariť objekt Point

				//pointId: segmentPoint.point.id,
				latitude: segmentPoint.point.latitude,
				longitude: segmentPoint.point.longitude,
				pointId: segmentPoint.point.id,
				segmentId: segmentPoint.segmentId,
				segmentPointId: segmentPoint.segmentPointId,
				segmentOrder: segmentPoint.segmentOrder,
				orderOnSegment: segmentPoint.orderOnSegment,
				distanceOnSegment: segmentPoint.distanceOnSegment / 1000, //meters
				timeOnSegment: segmentPoint.timeOnSegment,
				orderOnRoute: segmentPoint.orderOnRoute,
				distanceOnRoute: segmentPoint.distanceOnRoute / 1000, //meters
				timeOnRoute: segmentPoint.timeOnRoute,
				pointAction: wertyz.map.point.PointAction.NONE,
				segmentPointAction: wertyz.map.point.SegmentPointAction.NONE,
				parentProcessor: self,
				type: "segmentPoint",
				geometry: new ol.geom.Point(ol.proj.fromLonLat([segmentPoint.point.longitude, segmentPoint.point.latitude]))
			};

			featureOptions.listTypeValues = wertyz.point.createListTypeArray(segmentPoint.point);
			featureOptions.originalListTypeValues = wertyz.point.createListTypeArray(segmentPoint.point);
			featureOptions.listTypeAdditionalValues = wertyz.point.createAdditionalListTypeArray(segmentPoint.point);

			return featureOptions;
		};

		this._getStopPointFeature = function (stopId)
		{
			return self._stopPointFeatures.getArray().find(function (ft)
			{
				let listTypeValues = ft.get("listTypeValues");
				let featureStopId = listTypeValues.getTypeValue(wertyz.point.PointType.STOPID);

				return featureStopId === stopId.toString();
			});
		};

		this._setLayersByZoom = function ()
		{
			let zoom = self._map.getView().getZoom();
			//console.log(zoom);                 

			if (zoom >= 16)
			{
				if (wertyz.map.settings.route.getShowPoints())
					self._simplePointLayer.setVisible(true);
				if (self._editMode)
					self._setModifyInteractionsActive(true);
			}
			else
			{
				self._simplePointLayer.setVisible(false);
				self._setModifyInteractionsActive(false);
			}

			if (zoom >= 13)
			{
				self._stopPointLayer.setVisible(true);
				return;
			}

			self._stopPointLayer.setVisible(false);
		}

		this._setModifyInteractionsActive = function (active)
		{
			for (let i = 0; i < self._modifyInteractions.length; i++)
				self._modifyInteractions[i].setActive(active);
		};

		this._setModifiedRouteHelper = function (routeFeature, editMode)
		{
			if (editMode === true)
				self._modifiedRouteHelper.set(routeFeature);
			else
				self._modifiedRouteHelper.reset();
		};

		this._recomputeAfterFeatureAdded = function (feature)
		{
			let cords = ol.proj.transform(feature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
			let segmentId = feature.get("segmentId");
			let orderOnRoute = feature.get("orderOnRoute");
			let segmentPointAction = feature.get("segmentPointAction");
			let routeFeature = feature.get("routeFeature");
			let routePointFeatures = routeFeature.get("pointFeatures");
			let afterFeature = self.getPointFeature(routeFeature, orderOnRoute - 1);
			let isTheSameSegment = afterFeature.get("segmentId") === segmentId;
			let afterFeatureDistanceOnSegment = isTheSameSegment ? afterFeature.get("distanceOnSegment") : 0;
			let afterFeatureTimeOnSegment = isTheSameSegment ? afterFeature.get("timeOnSegment") : 0;
			let afterFeatureDistanceOnRoute = afterFeature.get("distanceOnRoute");
			let afterFeatureTimeOnRoute = afterFeature.get("timeOnRoute");
			let beforeFeature = self.getPointFeature(routeFeature, orderOnRoute + 1);
			let beforeFeatureDistanceOnSegment = beforeFeature.get("distanceOnSegment");
			let beforeFeatureDistanceOnRoute = beforeFeature.get("distanceOnRoute");
			let beforeFeatureTimeOnSegment = beforeFeature.get("timeOnSegment");
			let beforeFeatureTimeOnRoute = beforeFeature.get("timeOnRoute");

			//Distance
			let sphere = new ol.Sphere(wertyz.gps.R);
			let distance1 = sphere.haversineDistance(ol.proj.transform(afterFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326"), cords);
			let distance2 = sphere.haversineDistance(ol.proj.transform(beforeFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326"), cords);
			let distanceOnSegment = afterFeatureDistanceOnSegment + distance1;
			let distanceOnRoute = afterFeatureDistanceOnRoute + distance1;
			let distanceDiff = distanceOnRoute + distance2 - beforeFeatureDistanceOnRoute;

			//Time
			let ratio = beforeFeatureTimeOnSegment / beforeFeatureDistanceOnSegment;
			let time1 = ratio * distance1;
			let time2 = ratio * distance2;
			let timeOnSegment = afterFeatureTimeOnSegment + time1;
			let timeOnRoute = afterFeatureTimeOnRoute + time1;
			let timeDiff = timeOnRoute + time2 - beforeFeatureTimeOnRoute;

			feature.set("distanceOnSegment", distanceOnSegment);
			feature.set("distanceOnRoute", distanceOnRoute);
			feature.set("timeOnSegment", timeOnSegment);
			feature.set("timeOnRoute", timeOnRoute);

			if (segmentPointAction !== wertyz.map.point.SegmentPointAction.ADD &&
				segmentPointAction !== wertyz.map.point.SegmentPointAction.INVALIDATE)
				feature.set("segmentPointAction", segmentPointAction | wertyz.map.point.SegmentPointAction.VALUES);

			routePointFeatures.forEach(function (ft)
			{
				let isOrderOnRoute = ft.get("orderOnRoute") > orderOnRoute;
				let isValid = self._isValidFeature(ft);

				if (!isOrderOnRoute || !isValid)
					return;

				ft.set("distanceOnRoute", ft.get("distanceOnRoute") + distanceDiff);
				ft.set("timeOnRoute", ft.get("timeOnRoute") + timeDiff);

				if (ft.get("segmentId") !== segmentId)
					return;

				ft.set("distanceOnSegment", ft.get("distanceOnSegment") + distanceDiff);
				ft.set("timeOnSegment", ft.get("timeOnSegment") + timeDiff);

				let ftSegmentPointAction = ft.get("segmentPointAction");
				if (ftSegmentPointAction !== wertyz.map.point.SegmentPointAction.ADD)
					ft.set("segmentPointAction", ftSegmentPointAction | wertyz.map.point.SegmentPointAction.VALUES);
			});
		};

		this._recomputeAfterFeatureRemoved = function (beforeFeature)
		{
			let routeFeature = beforeFeature.get("routeFeature");
			let routePointFeatures = routeFeature.get("pointFeatures");
			let beforeFeatureOrderOnRoute = beforeFeature.get("orderOnRoute");
			let afterFeature = self.getPointFeature(routeFeature, beforeFeatureOrderOnRoute - 1);
			let afterFeatureCords = ol.proj.transform(afterFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
			let beforeFeatureCords = ol.proj.transform(beforeFeature.getGeometry().getCoordinates(), "EPSG:3857", "EPSG:4326");
			let beforeFeatureSegmentId = beforeFeature.get("segmentId");
			let isTheSameSegment = afterFeature.get("segmentId") === beforeFeatureSegmentId;
			let afterFeatureDistanceOnSegment = isTheSameSegment ? afterFeature.get("distanceOnSegment") : 0;
			let afterFeatureTimeOnSegment = isTheSameSegment ? afterFeature.get("timeOnSegment") : 0;
			let afterFeatureDistanceOnRoute = afterFeature.get("distanceOnRoute");
			let afterFeatureTimeOnRoute = afterFeature.get("timeOnRoute");
			let beforeFeatureDistanceOnSegment = beforeFeature.get("distanceOnSegment");
			let beforeFeatureTimeOnSegment = beforeFeature.get("timeOnSegment");
			let segmentPointAction = beforeFeature.get("segmentPointAction");

			//Distance
			let sphere = new ol.Sphere(wertyz.gps.R);
			let distance = sphere.haversineDistance(afterFeatureCords, beforeFeatureCords);
			let distanceOnSegment = afterFeatureDistanceOnSegment + distance;
			let distanceOnRoute = afterFeatureDistanceOnRoute + distance;
			let distanceDiff = beforeFeatureDistanceOnSegment - distanceOnSegment;

			//Time
			let ratio = beforeFeatureTimeOnSegment / beforeFeatureDistanceOnSegment;
			let time = distance * ratio;
			let timeOnSegment = afterFeatureTimeOnSegment + time;
			let timeOnRoute = afterFeatureTimeOnRoute + time;
			let timeDiff = beforeFeatureTimeOnSegment - timeOnSegment;

			beforeFeature.set("distanceOnSegment", distanceOnSegment);
			beforeFeature.set("distanceOnRoute", distanceOnRoute);
			beforeFeature.set("timeOnSegment", timeOnSegment);
			beforeFeature.set("timeOnRoute", timeOnRoute);

			if (segmentPointAction !== wertyz.map.point.SegmentPointAction.ADD &&
				segmentPointAction !== wertyz.map.point.SegmentPointAction.INVALIDATE)
				beforeFeature.set("segmentPointAction", segmentPointAction | wertyz.map.point.SegmentPointAction.VALUES);

			routePointFeatures.forEach(function (ft)
			{
				let isOrderOnRoute = ft.get("orderOnRoute") > beforeFeatureOrderOnRoute;
				let isValid = self._isValidFeature(ft);

				if (!isOrderOnRoute || !isValid)
					return;

				ft.set("distanceOnRoute", ft.get("distanceOnRoute") - distanceDiff);
				ft.set("timeOnRoute", ft.get("timeOnRoute") - timeDiff);

				if (ft.get("segmentId") !== beforeFeatureSegmentId)
					return;

				ft.set("distanceOnSegment", ft.get("distanceOnSegment") - distanceDiff);
				ft.set("timeOnSegment", ft.get("timeOnSegment") - timeDiff);

				let ftSegmentPointAction = ft.get("segmentPointAction");
				if (ftSegmentPointAction !== wertyz.map.point.SegmentPointAction.ADD &&
					ftSegmentPointAction !== wertyz.map.point.SegmentPointAction.INVALIDATE)
					ft.set("segmentPointAction", ftSegmentPointAction | wertyz.map.point.SegmentPointAction.VALUES);
			});
		};

		this._addFeatureChangeGeometryHandler = function (feature)
		{
			let geometry = feature.getGeometry();

			geometry.on("change", function (event)
			{
				let coordinates = ol.proj.transform(event.target.getCoordinates(), 'EPSG:3857', 'EPSG:4326');
				let oldLatitude = this.get("latitude");
				let oldLongitude = this.get("longitude");
				let newLatitude = wertyz.helper.toFixedFloat(coordinates[1], 5);
				let newLongitude = wertyz.helper.toFixedFloat(coordinates[0], 5);

				if (newLatitude === oldLatitude && newLongitude === oldLongitude)
					return;

				this.set("latitude", newLatitude);
				this.set("longitude", newLongitude);

				let lineString = this.get("routeFeature").getGeometry();
				let lineStringCoordinates = lineString.getCoordinates();
				let index = this.get("orderOnRoute") - 1;
				let pointAction = this.get("pointAction");
				let segmentPointAction = this.get("segmentPointAction");

				lineStringCoordinates[index] = this.getGeometry().getCoordinates();
				lineString.setCoordinates(lineStringCoordinates);

				if (pointAction !== wertyz.map.point.PointAction.ADD
					&& segmentPointAction !== wertyz.map.point.SegmentPointAction.ADD)
					this.set("pointAction", pointAction | wertyz.map.point.PointAction.MOVE);

				self._modifiedPointHelper.feature = this;
				self.event.call("featuregeometrychange", event.target);
			}, feature); //pass feature as "this" scope inside the callback
		};

		this._getSegmentPointsForSave = function ()
		{
			let segmentPoints = [];
			let syncId = 1;

			self._pointFeatures.forEach(function (feature)
			{
				let pointAction = feature.get("pointAction");
				let segmentPointAction = feature.get("segmentPointAction");
				if (pointAction === wertyz.map.point.PointAction.NONE
					&& segmentPointAction === wertyz.map.point.SegmentPointAction.NONE)
					return;

				let listTypeValues = feature.get("listTypeValues");
				let newListTypeValues = listTypeValues.getArray().slice();
				let listTypeValue;
				let originalTypeValue;
				let segmentPoint = {};
				let i;

				//#region SegmentPointAction

				if (segmentPointAction === wertyz.map.point.SegmentPointAction.INVALIDATE)
				{
					segmentPoint.segmentPointId = feature.get("segmentPointId");
					segmentPoints.push(segmentPoint);
					return;
				}

				if (segmentPointAction & wertyz.map.point.SegmentPointAction.ADD ||
					segmentPointAction & wertyz.map.point.SegmentPointAction.VALUES ||
					segmentPointAction & wertyz.map.point.SegmentPointAction.ORDER)
				{
					if (segmentPointAction & wertyz.map.point.SegmentPointAction.ADD ||
						segmentPointAction & wertyz.map.point.SegmentPointAction.VALUES)
					{
						segmentPoint.distanceOnSegment = wertyz.helper.toFixedFloat(feature.get("distanceOnSegment"), 3);
						segmentPoint.timeOnSegment = Math.round(feature.get("timeOnSegment"));
					}

					if (segmentPointAction & wertyz.map.point.SegmentPointAction.ADD ||
						segmentPointAction & wertyz.map.point.SegmentPointAction.ORDER)
					{
						segmentPoint.orderOnSegment = feature.get("orderOnSegment");

						if (segmentPointAction & wertyz.map.point.SegmentPointAction.ADD)
							segmentPoint.segmentId = feature.get("segmentId");
					}
				}

				if (segmentPointAction & wertyz.map.point.SegmentPointAction.ORDER)
				{
					segmentPoint.orderOnSegment = feature.get("orderOnSegment");
				}

				//#endregion

				if (pointAction & wertyz.map.point.PointAction.ADD)
				{
					//Synchronization id between client and server for new points
					segmentPoint.syncId = syncId;
					feature.set("syncId", syncId, false);
					syncId++;
				}
				else
				{
					segmentPoint.segmentPointId = feature.get("segmentPointId");
				}

				//#region PointAction               

				if (pointAction & wertyz.map.point.PointAction.ADD
					|| pointAction & wertyz.map.point.PointAction.MOVE)
				{
					segmentPoint.latitude = wertyz.helper.toFixedFloat(feature.get("latitude"), 5);
					segmentPoint.longitude = wertyz.helper.toFixedFloat(feature.get("longitude"), 5);
				}

				if (pointAction & wertyz.map.point.PointAction.TYPE)
				{
					let originalListTypeValues = feature.get("originalListTypeValues");
					i = listTypeValues.getLength();

					while (i--)
					{
						listTypeValue = listTypeValues.getAt(i);
						originalTypeValue = originalListTypeValues.getType(listTypeValue.listTypeId);

						if (originalTypeValue && originalTypeValue.value === listTypeValue.value)
							newListTypeValues.splice(i, 1);
					}

					for (i = 0; i < originalListTypeValues.getLength(); i++)
					{
						listTypeValue = listTypeValues.getType(originalTypeValue.listTypeId);
						originalTypeValue = originalListTypeValues.getAt(i);

						if (!listTypeValue)
							newListTypeValues.push({ T: originalTypeValue.listTypeId });
					}
				}

				if (pointAction & wertyz.map.point.PointAction.TYPE ||
					(pointAction & wertyz.map.point.PointAction.ADD && newListTypeValues.length))
				{
					for (i = 0; i < newListTypeValues.length; i++)
					{
						listTypeValue = newListTypeValues[i];

						if (!listTypeValue.value)
							delete listTypeValue.value;
						delete listTypeValue.valueId;
					}

					if (newListTypeValues.length)
						segmentPoint.listTypeValues = newListTypeValues;
				}

				if (!Object.keys(segmentPoint).length)
					return;

				//#endregion                            

				segmentPoints.push(segmentPoint);
			});

			return segmentPoints;
		};

		this._getSegmentsForSave = function ()
		{			
			let segmentIds = [];
			const retObject = 
			{
				"segments": []
			}					

			self._pointFeatures.forEach(function (feature)
			{
				let pointAction = feature.get("pointAction");
				let segmentPointAction = feature.get("segmentPointAction");

				if (pointAction === wertyz.map.point.PointAction.NONE
					&& segmentPointAction === wertyz.map.point.SegmentPointAction.NONE)
					return;							

				if (pointAction & wertyz.map.point.PointAction.ADD
					|| pointAction & wertyz.map.point.PointAction.MOVE
					|| pointAction & wertyz.map.point.PointAction.ORDER
					|| segmentPointAction === wertyz.map.point.SegmentPointAction.INVALIDATE)
				{
					segmentIds.push(feature.get("segmentId"));
				}		
				
			});

			segmentIds = wertyz.helper.distinct(segmentIds);			
			segmentIds.forEach((segmentId) => 
			{
				const segment = 
				{				
					"firmId": 1,	
					"segmentId": segmentId,
					"validFrom": parseInt(Date.now() / 1000),
					"validTo": null,
					"points": []
				};			

				const segmentFeatures = self._pointFeatures.getArray().filter((pointFeature) => 
				{
					return pointFeature.get("segmentId") === segmentId && self._isValidFeature(pointFeature);
				});		

				segmentFeatures.sort((s1, s2) => 
				{
					return s1.get("orderOnSegment") - s2.get("orderOnSegment");
				});
				
				if (segmentFeatures[0].get("orderOnRoute") !== 1)
				{									
					const firstSegmentFeature = self.getPointFeature(
						segmentFeatures[0].get("routeFeature"), 
						segmentFeatures[0].get("orderOnRoute") - 1);

					segment.points.push(
					{
						"id": firstSegmentFeature.get("segmentPointId") || 0,
						"latitude": wertyz.helper.toFixedFloat(firstSegmentFeature.get("latitude"), 5) * 100000,
						"longitude": wertyz.helper.toFixedFloat(firstSegmentFeature.get("longitude"), 5) * 100000,
						"order": 1,
					});
				}

				segmentFeatures.forEach((segmentFeature) => 
				{
					segment.points.push(
					{
						"id": segmentFeature.get("segmentPointId") || 0,
						"latitude": wertyz.helper.toFixedFloat(segmentFeature.get("latitude"), 5) * 100000,
						"longitude": wertyz.helper.toFixedFloat(segmentFeature.get("longitude"), 5) * 100000,
						"order": segmentFeature.get("orderOnSegment"),
					});
				});

				retObject.segments.push(segment);
			});

			return retObject;
		};

		this._isValidFeature = function (feature)
		{
			return feature.get("segmentPointAction") !== wertyz.map.point.SegmentPointAction.INVALIDATE;
		}

		this.getPointFeature = function (routeFeature, orderOnRoute)
		{
			return routeFeature.get("pointFeatures").find(function (ft)
			{
				return ft.get("orderOnRoute") === orderOnRoute && self._isValidFeature(ft);
			});
		};

		this.getLastPointFeature = function (routeFeature)
		{
			let pointFeatures = routeFeature.get("pointFeatures");

			for (let i = pointFeatures.length - 1; i >= 0; i--)
			{
				let feature = pointFeatures[i];

				if (self._isValidFeature(feature))
					return feature;
			}

			return null;
		};

		this.addPointFeature = function (orderOnRoute, longitude, latitude)
		{
			let beforeFeature = self.getPointFeature(self._modifiedRouteHelper.feature, orderOnRoute + 1);
			let beforeFeatureSegmentId = beforeFeature.get("segmentId");
			let beforeFeatureOrderOnRoute = beforeFeature.get("orderOnRoute");
			let cords = ol.proj.transform([longitude, latitude], "EPSG:3857", "EPSG:4326");
			let segmentId = beforeFeatureSegmentId;
			let segmentOrder = beforeFeature.get("segmentOrder");
			let orderOnSegment = beforeFeature.get("orderOnSegment");
			let routeFeature = beforeFeature.get("routeFeature");
			let routePointFeatures = routeFeature.get("pointFeatures");

			let featureOptions =
			{
				longitude: cords[0],
				latitude: cords[1],
				segmentId: segmentId,
				segmentOrder: segmentOrder,
				orderOnSegment: orderOnSegment,
				orderOnRoute: beforeFeatureOrderOnRoute,
				originalListTypeValues: new wertyz.point.ListTypeArray(),
				listTypeValues: new wertyz.point.ListTypeArray(),
				routeFeature: routeFeature,
				pointAction: wertyz.map.point.PointAction.ADD,
				segmentPointAction: wertyz.map.point.SegmentPointAction.ADD,
				parentProcessor: self,
				type: "segmentPoint",
				geometry: new ol.geom.Point([longitude, latitude])
			};

			let feature = new ol.Feature(featureOptions);

			self._addFeatureChangeGeometryHandler(feature);

			routePointFeatures.forEach(function (ft)
			{
				let isOrderOnRoute = ft.get("orderOnRoute") >= beforeFeatureOrderOnRoute;
				let isValid = self._isValidFeature(ft);

				if (!isOrderOnRoute || !isValid)
					return;

				ft.set("orderOnRoute", ft.get("orderOnRoute") + 1);

				if (segmentOrder !== ft.get("segmentOrder"))
					return;

				ft.set("orderOnSegment", ft.get("orderOnSegment") + 1);

				let ftSegmentPointAction = ft.get("segmentPointAction");
				if (ftSegmentPointAction !== wertyz.map.point.SegmentPointAction.ADD)
					ft.set("segmentPointAction", ftSegmentPointAction | wertyz.map.point.SegmentPointAction.ORDER);

			});
			self._recomputeAfterFeatureAdded(feature);

			let indexOfFeature = 0;
			let simplePointFeatures = self._simplePointFeatures.getArray();

			//simplePointFeatures might not contain beforeFeature because it can be a stop
			for (let i = simplePointFeatures.length - 1; i >= 0; i--)
			{
				let spf = simplePointFeatures[i];
				let isRouteFeature = spf.get("routeFeature") === routeFeature;
				let isOrderOnRoute = spf.get("orderOnRoute") >= beforeFeatureOrderOnRoute;
				let isValid = self._isValidFeature(spf);

				if (!isRouteFeature || isOrderOnRoute || !isValid)
					continue;

				indexOfFeature = i + 1;
				break;
			}
			self._simplePointFeatures.insertAt(indexOfFeature, feature);

			indexOfFeature = routePointFeatures.indexOf(beforeFeature);
			routePointFeatures.splice(indexOfFeature, 0, feature);
			indexOfFeature = self._pointFeatures.getArray().indexOf(beforeFeature);
			self._pointFeatures.insertAt(indexOfFeature, feature);

			return feature;
		};

		this.removePointFeature = function (feature)
		{
			let routeFeature = feature.get("routeFeature");
			let routePointFeatures = routeFeature.get("pointFeatures");
			let orderOnRoute = feature.get("orderOnRoute");
			let segmentPointAction = feature.get("segmentPointAction");
			let beforeFeature = self.getPointFeature(routeFeature, orderOnRoute + 1);
			let beforeFeatureSegmentId = beforeFeature.get("segmentId");

			routePointFeatures.forEach(function (ft)
			{
				let isOrderOnRoute = ft.get("orderOnRoute") > orderOnRoute;
				let isValid = self._isValidFeature(ft);

				if (!isOrderOnRoute || !isValid)
					return;

				ft.set("orderOnRoute", ft.get("orderOnRoute") - 1);

				if (beforeFeatureSegmentId !== ft.get("segmentId"))
					return;

				ft.set("orderOnSegment", ft.get("orderOnSegment") - 1);

				let ftSegmentPointAction = ft.get("segmentPointAction");
				if (ftSegmentPointAction !== wertyz.map.point.SegmentPointAction.ADD)
					ft.set("segmentPointAction", ftSegmentPointAction | wertyz.map.point.SegmentPointAction.ORDER);
			});

			self._recomputeAfterFeatureRemoved(beforeFeature);
			self._simplePointFeatures.remove(feature);

			if (segmentPointAction === wertyz.map.point.SegmentPointAction.ADD)
			{
				removeIndex = routePointFeatures.indexOf(feature);
				routePointFeatures.splice(removeIndex, 1);
				self._pointFeatures.remove(feature);
			}
			else
			{
				feature.set("segmentPointAction", wertyz.map.point.SegmentPointAction.INVALIDATE);
			}

			let lineString = feature.get("routeFeature").getGeometry();
			let lineStringCoordinates = lineString.getCoordinates();
			let index = orderOnRoute - 1;

			lineStringCoordinates.splice(index, 1);
			lineString.setCoordinates(lineStringCoordinates);
		};

		this.setEditMode = function (editMode)
		{
			self._editMode = editMode;
			self._setModifyInteractionsActive(editMode);
		}

		this.save = function (feature)
		{
			self.saveSegments(feature);
			return;

			let segmentPoints = self._getSegmentPointsForSave();			
			
			if (!segmentPoints.length)
				return true;			

			let data = { data: JSON.stringify(segmentPoints) };		

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.saveRichSegmentPointsUrl,
					data: data
				})
				.done(function (data)
				{
					if (!data || !data.state)
					{
						alert("Save segment points - No data in ajax response!");
						return;
					}

					if (data.state === wertyz.map.ajax.resultState.ERROR)
					{
						alert("Save segment points error: " + data.info);
						return;
					}

					if (!data.data || !data.data.length)
					{
						alert("Save segment points result: No data!");
						return;
					}

					let resultSegmentPoints = data.data;

					console.log(resultSegmentPoints);

					resultSegmentPoints.forEach(function (resultSegmentPoint)
					{
						let feature;

						if (resultSegmentPoint.syncId)
						{
							feature = self._pointFeatures.getArray().find(function (ft)
							{
								return ft.get("syncId") === resultSegmentPoint.syncId;
							});
							feature.set("segmentPointId", resultSegmentPoint.segmentPointId);
							feature.set("pointId", resultSegmentPoint.pointId);
						}
						else
						{
							feature = self._pointFeatures.getArray().find(function (ft)
							{
								return ft.get("segmentPointId") === resultSegmentPoint.segmentPointId;
							});

							if (feature.get("segmentPointAction") === wertyz.map.point.SegmentPointAction.INVALIDATE)
							{
								self._pointFeatures.remove(feature);
								return;
							}
						}

						let pointAction = feature.get("pointAction");
						if (pointAction & wertyz.map.point.PointAction.TYPE)
						{
							let originalListTypeValues = feature.get("originalListTypeValues");
							let newOriginalListTypeValuesArray = feature.get("listTypeValues").getArray().slice();

							originalListTypeValues.setArray(newOriginalListTypeValuesArray);
						}

						feature.set("pointAction", wertyz.map.point.PointAction.NONE);
						feature.set("segmentPointAction", wertyz.map.point.SegmentPointAction.NONE);
					});

					alert("Save segment points - Ok!");
				})
				.fail(function (error)
				{
					alert("Save segment points - Error: " + errorThrown);
				})
				.always(function ()
				{
					//force syncId delete
					self._pointFeatures.forEach(function (feature)
					{
						if (!feature.get("syncId"))
							return;

						feature.set("syncId", null, false);
					});
				});
		};

		this.saveSegments = function (feature)
		{			
			let segments = self._getSegmentsForSave();

			console.log(self._pointFeatures);
			console.log(segments);
			//return;
			
			if (!segments.length)
				return true;			

			let data = { data: JSON.stringify(segments) };		

			$.ajax(
				{
					type: "POST",
					url: wertyz.map.ajax.saveSegmentsUrl,
					data: data
				})
				.done(function (data)
				{
					// if (!data || !data.state)
					// {
					// 	alert("Save segment points - No data in ajax response!");
					// 	return;
					// }

					// if (data.state === wertyz.map.ajax.resultState.ERROR)
					// {
					// 	alert("Save segment points error: " + data.info);
					// 	return;
					// }

					// if (!data.data || !data.data.length)
					// {
					// 	alert("Save segment points result: No data!");
					// 	return;
					// }					

					alert("Save segments - Ok!");
				})
				.fail(function (error)
				{
					alert("Save segment points - Error: " + errorThrown);
				})
				.always(function ()
				{

				});
		};	

		this.refresh = function (routes)
		{
			self.clear();
			self._createFeatures(routes);
		};

		this.clear = function ()
		{
			self._stopPointFeatures.clear();
			self._simplePointFeatures.clear();
			self._pointFeatures.clear();
			self._routeFeatures.clear();
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.filterStopPointFeatures = function (routeFeature)
		{
			return self._stopPointFeatures.getArray().filter(spf => spf.get("routeFeature") === routeFeature);
		};

		this.filterSimplePointFeatures = function (routeFeature, optParameters)
		{
			return self._simplePointFeatures.getArray().filter(spf =>
			{
				let passed = spf.get("routeFeature") === routeFeature;
				if (!passed)
					return false;

				if (optParameters && optParameters.fromOrderOnRoute)
					passed = spf.get("orderOnRoute") >= optParameters.fromOrderOnRoute;
				if (!passed)
					return false;

				if (optParameters && optParameters.segmentId)
					passed = spf.get("segmentId") === optParameters.segmentId;
				if (!passed)
					return false;

				return true;
			});
		};

		this.getRouteFeatures = function ()
		{
			return self._routeFeatures;
		};

		this.getRouteFeature = function (routeNumber)
		{
			let routeFeature = self._routeFeatures.getArray().find(rf => rf.get("routeNumber") === routeNumber);

			return routeFeature;
		};

		this.getExtent = function ()
		{
			let extent1 = self._stopPointLayer.getSource().getExtent();
			let extent2 = self._simplePointLayer.getSource().getExtent();
			let extent = ol.extent.extend(extent1, extent2);

			return extent;
		};

		this.fitMap = function (options)
		{
			if (!self._pointFeatures.getLength())
			{
				self._map.getView().setCenter(ol.proj.fromLonLat([0, 0]));
				self._map.getView().setZoom(2);
				return;
			}

			let extent = self.getExtent();
			self._map.getView().fit(extent, options);
		};

		this.fitMapOnFeatures = function (features, options)
		{
			let extent = features[0].getGeometry().getExtent();

			for (let i = 1; i < features.length; i++)
			{
				let featureExtent = features[i].getGeometry().getExtent();
				ol.extent.extend(extent, featureExtent);
			}

			self._map.getView().fit(extent, options);
		};

		this.fitMapOnStopPointFeatures = function (stopIds, options)
		{
			let features = [];

			for (let i = 0; i < stopIds.length; i++)
			{
				let stopId = stopIds[i];
				let feature = self._getStopPointFeature(stopId);

				if (!feature)
					continue;

				features.push(feature);
			}

			if (!features.length)
				return;

			self.fitMapOnFeatures(features, options);
		};

		this.hideMap = function ()
		{
			self._stopPointLayer.setVisible(false);
			self._simplePointLayer.setVisible(false);
			self._routeLayer.setVisible(false);
		};

		this.showMap = function ()
		{
			self._stopPointLayer.setVisible(true);
			self._simplePointLayer.setVisible(true);
			self._routeLayer.setVisible(true);
		};

		this.getResolution = function (coords)
		{
			let view = self._map.getView();
			let resolution = view.getResolution();
			let projection = view.getProjection();

			if (!coords)
				coords = view.getCenter();

			let resolutionAtCoords = projection.getPointResolution(resolution, coords);

			return resolutionAtCoords;
		};

		this._init(routes);
	}
};

wertyz.map.popup =
{
	Extender: function (mapExtender, options)
	{
		let self = this;
		this._mapExtender = mapExtender;
		this._map = mapExtender.getMap();
		this._feature = null;
		this._displayMode = null;
		this._isContentCollapsed = true;
		this._isShowed = false;

		let popupOpt;
		if (options)
		{
			popupOpt =
			{
				panMapIfOutOfView: options.panMapIfOutOfView,
				panMapIfOutOfViewOffsetX: options.panMapIfOutOfViewOffsetX,
				panMapIfOutOfViewOffsetY: options.panMapIfOutOfViewOffsetY
			};
		}
		this._popup = new ol.Overlay.Popup(popupOpt);

		this.vehicle = new function ()
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			this._showFollowButton = (options && options.vehicle && typeof options.vehicle.showFollowButton !== "undefined")
				? options.vehicle.showFollowButton
				: true;

			this._showAnimButton = (options && options.vehicle && typeof options.vehicle.showAnimButton !== "undefined")
				? options.vehicle.showAnimButton
				: true;

			this._getContent$ = function (vehicle)
			{
				if (!vehicle)
				{
					let feature = self._feature;

					vehicle =
					{
						obu: feature.get("obu"),
						vin: feature.get("vin"),
						licence: feature.get("licence"),
						latitude: feature.get("latitude"),
						longitude: feature.get("longitude"),
						altitude: feature.get("altitude"),
						driverName: feature.get("driverName"),
						driverNumber: feature.get("driverNumber"),
						order: feature.get("order"),
						orderColor: feature.get("orderColor"),
						line: feature.get("line"),
						trip: feature.get("trip"),
						tripDate: feature.get("tripDate"),
						tripColor: feature.get("tripColor"),
						routeNumber: feature.get("routeNumber"),
						planned: feature.get("planned"),
						stopId: feature.get("stopId"),
						platform: feature.get("platform"),
						nextStopArrival: feature.get("nextStopArrival"),
						finalStopArrival: feature.get("finalStopArrival"),
						passenger: feature.get("passenger"),
						passengerCapacityUsage: feature.get("passengerCapacityUsage"),
						delay: feature.get("delay"),
						deviation: feature.get("deviation"),
						deviationGps: feature.get("deviationGps"),
						invalidGps: feature.get("invalidGps"),
						speed: feature.get("speed"),
						azimuth: feature.get("azimuth"),
						state: feature.get("state"),
						stateColor: feature.get("stateColor"),
						stateColorExtended: feature.get("stateColorExtended"),
						communication: feature.get("isCommunicating"),
						communication24h: feature.get("isCommunicating24h"),
						communicationDuty1h: feature.get("isCommunicatingAfterActualDutyEnd1h"),
						lastCommunication: feature.get("lastCommunication"),
						garageNumber: feature.get("garageNumber"),
						garageStatus: feature.get("garageStatus"),
						obuState: feature.get("obuState"),

						statusIdCommunication: feature.get("statusIdCommunication"),
						//statusIdCommunication24h: feature.get("statusIdCommunication24h"),
						//statusIdCommunicationDuty1h: feature.get("statusIdCommunicationDuty1h"),
						statusIdGarage: feature.get("statusIdGarage"),
						statusIdGpsValidation: feature.get("statusIdGpsValidation"),
						statusIdOccupacy: feature.get("statusIdOccupacy"),
						statusIdObuState: feature.get("statusIdObuState"),
						statusIdTripRoute: feature.get("statusIdTripRoute")
					};
				}

				let $wrapper = $("<div></div>");
				let $header = $("<div></div>")
					.addClass("header")
				let $footer = $("<div></div>")
					.addClass("footer");
				let $data = $("<div></div>").addClass("data");
				let $table = $("<table></table>").addClass("content");
				let $follow = null;
				let $anim = null;

				if (self._isContentCollapsed)
					$table.addClass("collapsed");

				let $buttonWrapper = $("<div></div>")
					.addClass("buttons");

				if (self.vehicle._showFollowButton)
				{
					$follow = $("<span/>")
						.attr("data-obu", vehicle.obu)
						.addClass("button")
						.addClass("glyphicons glyphicons-nearby-circle selected")
						.click(function ()
						{
							self.follow(this);
						});

					if (vehicle.obu !== wertyz.map.settings.vehicle.getFollowedObu())
					{
						$follow.attr("data-action", "follow")
							.removeClass("selected");
					}
					else
					{
						$follow.attr("data-action", "stopfollow")
							.addClass("selected");
					}
				}

				if (self.vehicle._showAnimButton)
				{
					$anim = $("<span/>")
						.attr("data-obu", vehicle.obu)
						.addClass("button")
						.addClass("glyphicons glyphicons-play")
						.click(function ()
						{
							self.vehicle.event.call("animate", vehicle.obu);
						});
				}

				if (vehicle.licence)
					$header.append(vehicle.licence);
				if (vehicle.vin)
				{
					if (vehicle.licence)
						$header.append(" / ");
					$header.append(vehicle.vin);
				}
				if (vehicle.licence || vehicle.vin)
					$header.append(" / ");

				$header.append(vehicle.obu);
				$wrapper.append($header);

				let arrow = "&nbsp;&nbsp;\u2192&nbsp;&nbsp;";

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.licence") + " - "
					+ wertyz.map.getLocale("infobox.vin") + " - "
					+ wertyz.map.getLocale("infobox.obu") + ": </span></td><td>"
					+ (vehicle.licence || "") + (vehicle.vin ? " - " + vehicle.vin : "") + (vehicle.obu ? " - " + vehicle.obu : "")
					+ "</td></tr>");

				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.communication") + ": </span></td><td>" +
					(vehicle.lastCommunication ? wertyz.helper.getDateFromShiftedUTCString(vehicle.lastCommunication).toLocaleString() : "") + "</td></tr>");
				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.driver") + ": </span></td><td>" +
					(vehicle.driverNumber || "") + (vehicle.driverName ? (" - " + vehicle.driverName) : "") + "</td></tr>");

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.order") + arrow
					+ wertyz.map.getLocale("infobox.line") + arrow
					+ wertyz.map.getLocale("infobox.trip") + ": </span></td><td>"
					+ (vehicle.order || "")
					+ (vehicle.line ? arrow + vehicle.line : "")
					+ (vehicle.trip ? arrow + vehicle.trip : "")
					+ "</td></tr>");
				$table.append("<tr class='noimportant'><td><span class='description'>" + wertyz.map.getLocale("infobox.tripdate") + ": </span></td><td>" +
					(vehicle.tripDate ? wertyz.helper.getDateFromShiftedUTCString(vehicle.tripDate).toLocaleString() : "") + "</td></tr>");
				$table.append("<tr class='noimportant'><td><span class='description'>" + wertyz.map.getLocale("infobox.route") + ": </span></td><td>" +
					(vehicle.routeNumber || "") + "</td></tr>");
				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.position") + ": </span></td><td>"
					+ vehicle.latitude + ", " + vehicle.longitude
					+ (wertyz.helper.isNumber(vehicle.altitude) ? (", " + vehicle.altitude + " m") : "") + "</td></tr>");

				$table.append("<tr class='noimportant'><td><span class='description'>" + wertyz.map.getLocale("infobox.passengers") + ": </span></td><td>" +
					(vehicle.passenger || "") + "</td></tr>");
				// $table.append("<tr class='noimportant'><td><span class='description'>" + wertyz.map.getLocale("infobox.passengers") + ": </span></td><td>" +
				// 	(wertyz.helper.isNumber(vehicle.passengerCapacityUsage) ? (vehicle.passengerCapacityUsage + " %") : "") + "</td></tr>");
				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.delay") + ": </span></td><td>"
					+ (wertyz.helper.isNumber(vehicle.delay) ? (wertyz.helper.numberToHHMMSS(vehicle.delay)) : "") + "</td></tr>");
				$table.append("<tr class='noimportant'><td><span class='description'>" + wertyz.map.getLocale("infobox.deviation") + ": </span></td><td>"
					+ (wertyz.helper.isNumber(vehicle.deviationGps) ? (vehicle.deviationGps + " m") : "") + "</td></tr>");

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.speed") + arrow
					+ wertyz.map.getLocale("infobox.azimuth") + ": </span></td><td>"
					+ (wertyz.helper.isNumber(vehicle.speed) ? (Math.round(vehicle.speed) + " km/h") : "")
					+ (wertyz.helper.isNumber(vehicle.azimuth) ? (arrow + vehicle.azimuth + " °") : "") + "</td></tr>");

				$data.append($table);
				$buttonWrapper.append($follow);
				$buttonWrapper.append($anim);
				$footer.append($buttonWrapper);
				$wrapper.append($data);
				$wrapper.append($footer);

				return $wrapper;
			};

			this._setCustomClasses = function ()
			{
				self.vehicle._removeCustomClasses();
				self._getContainer$().addClass("vehicle");

				let type = self._feature.get("type");
				let stateColor = self._feature.get("stateColor");
				let stateClass = wertyz.map.vehicle.state.getClass(stateColor);

				if (type === "vehicle.animation")
					self._getContainer$().addClass("animation");

				self._getContainer$().addClass(stateClass);
			}

			this._removeCustomClasses = function ()
			{
				self._getContainer$().removeClass("vehicle");

				wertyz.map.vehicle.state.ColorMap.forEach(function (color, value)
				{
					let stateClass = wertyz.map.vehicle.state.getClass(value);

					self._getContainer$().removeClass(stateClass);
				});
			}

			this.update = function (feature)
			{
				if (feature)
					self._feature = feature;

				let newContent = self._getContent$();

				$(self._popup.content).html(newContent);
				self.vehicle._setCustomClasses();
				self.refreshPosition();
			};
		};

		this.alarm = new function ()
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			this._getContent$ = function (alarm)
			{
				if (!alarm)
				{
					let feature = self._feature;

					alarm =
					{
						id: feature.get("id"),
						alarmType: feature.get("alarmType"),
						alarmSubtype: feature.get("alarmSubtype"),
						sendedAt: feature.get("sendedAt"),
						receivedAt: feature.get("receivedAt"),
						latitude: feature.get("latitude"),
						longitude: feature.get("longitude"),
						altitude: feature.get("altitude"),
						obu: feature.get("obu"),
						vin: feature.get("vin"),
						licence: feature.get("licence"),
						order: feature.get("order"),
						line: feature.get("line"),
						trip: feature.get("trip"),
						driverName: feature.get("driverName"),
					};
				}

				let $wrapper = $("<div></div>");
				let $header = $("<div></div>")
					.addClass("header")
				let $footer = $("<div></div>")
					.addClass("footer");
				let $data = $("<div></div>").addClass("data");
				let $table = $("<table></table>").addClass("content");
				let $follow = null;
				let $anim = null;

				if (self._isContentCollapsed)
					$table.addClass("collapsed");

				let $buttonWrapper = $("<div></div>")
					.addClass("buttons");

				$header.append(alarm.id);
				$wrapper.append($header);

				let $solveButton = $("<span/>")
					.addClass("button")
					.addClass("glyphicons glyphicons-pencil")
					.click(function ()
					{
						self.alarm.event.call("solve", alarm.id);
					});

				$buttonWrapper.append($solveButton);

				let arrow = "&nbsp;&nbsp;\u2192&nbsp;&nbsp;";

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.licence") + " - "
					+ wertyz.map.getLocale("infobox.vin") + " - "
					+ wertyz.map.getLocale("infobox.obu") + ": </span></td><td>"
					+ (alarm.licence || "") + (alarm.vin ? " - " + alarm.vin : "") + (alarm.obu ? " - " + alarm.obu : "")
					+ "</td></tr>");

				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.sendedAt") + ": </span></td><td>" +
					(alarm.sendedAt ? wertyz.helper.getDateFromShiftedUTCString(alarm.sendedAt).toLocaleString() : "") + "</td></tr>");
				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.receivedAt") + ": </span></td><td>" +
					(alarm.receivedAt ? wertyz.helper.getDateFromShiftedUTCString(alarm.receivedAt).toLocaleString() : "") + "</td></tr>");

				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.driver") + ": </span></td><td>" +
					(alarm.driverName || "") + "</td></tr>");

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.order") + arrow
					+ wertyz.map.getLocale("infobox.line") + arrow
					+ wertyz.map.getLocale("infobox.trip") + ": </span></td><td>"
					+ (alarm.order || "")
					+ (alarm.line ? arrow + alarm.line : "")
					+ (alarm.trip ? arrow + alarm.trip : "")
					+ "</td></tr>");

				$table.append("<tr class='noimportant'><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.position") + ": </span></td><td>"
					+ alarm.latitude + ", " + alarm.longitude
					+ (wertyz.helper.isNumber(alarm.altitude) ? (", " + alarm.altitude + " m") : "") + "</td></tr>");

				$data.append($table);
				$buttonWrapper.append($follow);
				$buttonWrapper.append($anim);
				$footer.append($buttonWrapper);
				$wrapper.append($data);
				$wrapper.append($footer);

				return $wrapper;
			};

			this._setCustomClasses = function ()
			{
				self.alarm._removeCustomClasses();
				self._getContainer$().addClass("alarm");
			}

			this._removeCustomClasses = function ()
			{
				self._getContainer$().removeClass("alarm");
			}

			this.update = function (feature)
			{
				if (feature)
					self._feature = feature;

				let featureCoordinates = self._feature.getGeometry().getCoordinates();
				let newContent = self._getContent$();

				self._popup.setPosition(featureCoordinates);
				$(self._popup.content).html(newContent);
				self.vehicle._setCustomClasses();
			};
		};

		this.point = new function ()
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			this.type = new function ()
			{
				wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

				this._$container = null;
				this._items = [],
					this._isInitialized = false;

				this.edit = function ()
				{
					if (!self.point.type._isInitialized)
					{
						self.point.type._createMenu();
						self.point.type._isInitialized = true;
					}

					self._displayMode = wertyz.map.popup.DisplayMode.EDITPOINTTYPE;

					let $data = self._getContainer$()
						.find("div.data");
					let $button = $data
						.siblings("div.footer")
						.find(".edit");

					self._getContainer$().find(".header").find(".switch").css("visibility", "hidden");

					$data.html(self.point.type._getContent$());

					$button.hide();
					$button.siblings().hide();
					$button.siblings(".backedit").show();
					$button.siblings(".saveedit").show();
					$button.siblings(".remove").show();
					$button.siblings(".removenextonsegment").show();
					$button.siblings(".removenextonroute").show();

					$data.find("div.close").each(function ()
					{
						$(this).height($(this).parent().height());
					});

					self.point.type.event.call("open");
				};

				this._create = function (item)
				{
					let $item = $("<div></div>")
						.addClass("item " + item.cssClass)
						.attr("data-id", item.id)
						.html(item.content)
						.click(function ()
						{
							if (typeof item.click === "function")
								item.click.apply($(this), []);
						})
						.hover(
							function ()
							{
								if ($(this).hasClass("staticitem"))
									return;
								$(this).addClass("hover");
							},
							function ()
							{
								if ($(this).hasClass("staticitem"))
									return;
								$(this).removeClass("hover");
							}
						);

					if (!$item.hasClass("staticitem"))
					{
						let $close = $("<div></div>")
							.html("&#10006;")
							.addClass("close")
							.click(function (event)
							{
								event.stopPropagation();

								//if (self.point.type._getVisibleCount() === 1)
								//   return;                          

								if (typeof item.removeClick === "function")
									item.removeClick.apply($(this), []);
							})
							.appendTo($item.find(".wraptable"));
					}

					return $item;
				};

				this._createMenu = function ()
				{
					let $select = $("<select/>")
						.css("minWidth", "50%")
						.css("vertical-align", "top");
					let $option = $("<option/>")
						.val("-1")
						.text(wertyz.map.getLocale("infobox.addPointType"))
						.appendTo($select);

					$select.change(function ()
					{
						let $this = $(this);
						let selectedListTypeId = parseInt($this.val());
						let highlightedId = self.point.type._getHighlightedId();

						if (selectedListTypeId !== highlightedId)
						{
							self.point.type._setVisible(selectedListTypeId, true);
							self.point.type._setHighlighted(selectedListTypeId, true);

							let listTypeValues = self._feature.get("listTypeValues");
							let listTypeValue = listTypeValues.find(function (item)
							{
								return item.listTypeId === selectedListTypeId;
							});

							if (listTypeValue)
							{
								self.point.type._setValue(listTypeValue.value);
							}
							else
							{
								self.point.type._setPointListTypeValue(selectedListTypeId);
								self.point.type._setValue(null);
							}

							self._feature.changed();
							self._set();
							self.point._refreshHeader();

							let pointAction = self._feature.get("pointAction");
							if (pointAction !== wertyz.map.point.PointAction.ADD)
								self._feature.set("pointAction", pointAction | wertyz.map.point.PointAction.TYPE)
						}

						$input1.focus();
						$this.val(-1);
					});
					//$select.chosen();

					self.point.type._add(
						{
							id: "selecttype",
							cssClass: "staticitem",
							content: $select,
							click: null
						});

					for (let pointTypeName in wertyz.point.PointType)
					{
						let pointTypeId = wertyz.point.PointType[pointTypeName];
						let localizedPointTypeName = "infobox." + wertyz.map.getLocale(pointTypeName);

						$select.append("<option value='" + pointTypeId + "'>" + localizedPointTypeName + "</option>");

						(function (pt)
						{
							self.point.type._add({
								id: pt.id,
								cssClass: pt.name.replace(/\s+/g, "").toLowerCase(),
								content: "<div class='wraptable'><div class='name'>" + pt.name + "</div></div>",
								click: function ()
								{
									let listTypeValues = self._feature.get("listTypeValues");
									let listTypeValue = listTypeValues.find(function (item)
									{
										return item.listTypeId === pt.id;
									});
									if (listTypeValue)
										self.point.type._setValue(listTypeValue.value);
									else
										self.point.type._setValue(null);

									self.point.type._setHighlighted(pt.id, true);
									$input1.focus();
								},
								removeClick: function ()
								{
									let listTypeValues = self._feature.get("listTypeValues");
									let listTypeValue = listTypeValues.find(function (item)
									{
										return item.listTypeId === pt.id;
									});

									if (listTypeValue)
									{
										listTypeValue.value = null;
										listTypeValues.splice(listTypeValues.indexOf(listTypeValue), 1);
									}

									self.point.type._setVisible(pt.id, false);

									let highlightedId = self.point.type._getHighlightedId();
									if (pt.id === highlightedId)
									{
										self.point.type._setHighlighted(highlightedId, false);
										self.point.type._setValue(null);
										if (self.point.type._getVisibleCount() > 0)
											self.point.type._highlightFirst();
									}

									self._feature.changed();
									self._set();
									self.point._refreshHeader();

									let pointAction = self._feature.get("pointAction");
									if (pointAction !== wertyz.map.point.PointAction.ADD)
										self._feature.set("pointAction", pointAction | wertyz.map.point.PointAction.TYPE)
								}
							});
						})({ id: pointTypeId, name: pointTypeName });
					}

					let $divInputs = $("<div/>");
					let $input1 = $("<input/>",
						{
							type: "text"
						})
						.keyup(function ()
						{
							let highlightedId = self.point.type._getHighlightedId();
							if (isNaN(highlightedId))
								return;

							self.point.type._setPointListTypeValue(highlightedId, $(this).val() || null);

							self._feature.changed();
							self._set();
							self.point._refreshHeader();

							let pointAction = self._feature.get("pointAction");
							if (pointAction !== wertyz.map.point.PointAction.ADD)
								self._feature.set("pointAction", pointAction | wertyz.map.point.PointAction.TYPE)
						})
						.keypress(function ()
						{
							if (event.which === 13)
							{
								//$(this).next().focus();
								self.hide();
							}
						})
						.appendTo($divInputs);

					self.point.type._add(
						{
							id: "value",
							cssClass: "staticitem",
							content: $divInputs,
							click: null
						});

					self.point.type.event.on("open", function ()
					{
						let i;

						self.point.type._setValue(null);

						for (i in wertyz.point.PointType)
							self.point.type._setVisible(wertyz.point.PointType[i], false);

						let listTypeValues = self._feature.get("listTypeValues");
						if (listTypeValues.getLength() === 0)
							return;

						for (i = 0; i < listTypeValues.getLength(); i++)
						{
							self.point.type._setVisible(listTypeValues.getAt(i).listTypeId, true);
						}

						if (self.point.type._getVisibleCount() > 0)
							self.point.type._highlightFirst();
					});
				};

				this._getContent$ = function ()
				{
					self.point.type._$container = $("<div/>")
						.addClass("ol-edit");

					$.each(self.point.type._items, function (i, item)
					{
						self.point.type._$container.append(self.point.type._create(item));
					});

					return self.point.type._$container;
				};

				this._add = function (item)
				{
					self.point.type._items.push(item);
				};

				this._setPointListTypeValue = function (listTypeId, value)
				{
					let listTypeValues = self._feature.get("listTypeValues");
					let listTypeValue = listTypeValues.find(function (item)
					{
						return item.listTypeId === listTypeId;
					});

					if (listTypeValue)
					{
						listTypeValue.value = value;
					}
					else
					{
						listTypeValues.push(
							{
								listTypeId: listTypeId,
								value: value || null,
								valueId: null
							});
					}
				};

				this._setHighlighted = function (menuId, highlighted)
				{
					let $item = $($.grep(self.point.type._$container.find("div.item").not("div.staticitem"),
						function (item, i)
						{
							return $(item).attr("data-id") === menuId.toString();
						})[0]);

					if (highlighted === true)
					{
						$item.addClass("highlight");
						$item
							.siblings()
							.removeClass("highlight");
					} else
					{
						$item.removeClass("highlight");
					}
				};

				this._getHighlightedId = function ()
				{
					let index = parseInt(self.point.type._$container.find("div.highlight").attr("data-id"));

					return index;
				};

				this._getVisibleCount = function ()
				{
					let count = $.grep(self.point.type._items, function (item, i)
					{
						return item.visible === true;
					}).length;

					return count;
				};

				this._getFirstVisibleId = function ()
				{
					let itemsGrep = $.grep(self.point.type._items,
						function (item, i)
						{
							return item.visible === true;
						});

					if (itemsGrep.length > 0)
						return itemsGrep[0].id;
					return null;
				};

				this._setVisible = function (id, visible)
				{
					let item = self.point.type._items.find(function (item, i)
					{
						return item.id === id;
					});
					item.visible = visible;

					let $item = self.point.type._$container.find("div.item[data-id=" + item.id + "]");
					if (visible)
						$item.show();
					else
						$item.hide();
				};

				this._setPoint = function (point)
				{
					this.point = point;
				};

				this._setValue = function (value)
				{
					self.point.type._$container.find("input[type=text]:eq(0)").val(value);
				};

				this._highlightFirst = function ()
				{
					let visibleId = self.point.type._getFirstVisibleId();
					self.point.type._setHighlighted(visibleId, true);

					let listTypeValues = self._feature.get("listTypeValues");
					let listTypeValue = listTypeValues.find(function (item)
					{
						return item.listTypeId === visibleId;
					});
					if (listTypeValue)
						self.point.type._setValue(listTypeValue.value);
					else
						self.point.type._setValue(null);
				};
			};

			this._getContent$ = function ()
			{
				let feature = self._feature;
				let latitude = wertyz.helper.toFixedFloat(feature.get("latitude"), 5)
				let longitude = wertyz.helper.toFixedFloat(feature.get("longitude"), 5)

				//SegmentPoint               
				let orderOnRoute = feature.get("orderOnRoute");
				let listTypeValues = feature.get("listTypeValues");
				let isSegmentPoint = wertyz.helper.isNumber(orderOnRoute);
				let isInfoTable = listTypeValues.containsType(wertyz.point.PointType.INFOTABLE);
				let isStop = listTypeValues.containsType(wertyz.point.PointType.STOPID);


				//Other
				let pointId = feature.get("id");
				let arrow = "&nbsp;&nbsp;\u2192&nbsp;&nbsp;";

				let $wrapper = $("<div></div>");
				let $header = self.point._getHeader$();
				let $footer = $("<div></div>")
					.addClass("footer");
				let $data = $("<div></div>").addClass("data");
				let $table = $("<table></table>").addClass("content");
				let $buttonWrapper = $("<div></div>")
					.addClass("buttons");
				let $edit = $("<span/>")
					.addClass("button")
					.addClass("edit")
					.addClass("glyphicons glyphicons-show-thumbnails-with-lines")
					.click(function ()
					{
						self.point.type.edit(this);
					});
				let $backEdit = $("<span/>")
					.addClass("button")
					.addClass("backedit")
					.addClass("glyphicons glyphicons-unshare")
					.click(function ()
					{
						self._displayMode = wertyz.map.popup.DisplayMode.POINT;
						self._getContainer$().find(".header").find(".switch").css("visibility", "");
						self.show(self._feature);
					})
					.hide();
				let $saveEdit = $("<span/>")
					.addClass("button")
					.addClass("saveedit")
					.addClass("glyphicons glyphicons-floppy-disk")
					.click(function ()
					{
						self.point.event.call("save", feature);
					})
					.hide();
				let $remove = $("<span/>")
					.addClass("button")
					.addClass("remove")
					.addClass("glyphicons glyphicons-bin")
					.click(function ()
					{
						self.point.event.call("remove", feature);
					})
					.hide();
				let $removeNextOnSegment = $("<span/>")
					.html(" segment")
					.addClass("button")
					.addClass("removenextonsegment")
					.addClass("glyphicons glyphicons-cleaning") //vector-path-line
					.click(function ()
					{
						self.point.event.call("removenextonsegment", feature);
					})
					.hide();
				let $removeNextOnRoute = $("<span/>")
					.text(" route")
					.addClass("button")
					.addClass("removenextonroute")
					.addClass("glyphicons glyphicons-cleaning") //vector-path-line
					.click(function ()
					{
						self.point.event.call("removenextonroute", feature);
					})
					.hide();

				if (isInfoTable)
				{
					let $showInfoTable = $("<span/>")
						.addClass("button")
						.addClass("screenshot")
						.addClass("glyphicons glyphicons-display")
						.click(function ()
						{
							self.point.event.call("screenshot", listTypeValues.getType(wertyz.point.PointType.INFOTABLE).valueId);
						});
					let $sendMessageInfoTable = $("<span/>")
						.attr("href", "#")
						.addClass("button")
						.addClass("message")
						.addClass("glyphicons glyphicons-message-out")
						.click(function ()
						{
							self.point.event.call("message", listTypeValues.getType(wertyz.point.PointType.INFOTABLE).valueId);
						});

					$buttonWrapper.append($showInfoTable);
					$buttonWrapper.append($sendMessageInfoTable);
				}

				if (isStop)
					self._getContainer$().addClass("stop");
				else
					self._getContainer$().removeClass("stop");

				$wrapper.append($header);

				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.latitude") + ": </span></td><td>" + latitude + "</td></tr>");
				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.longitude") + ": </span></td><td>" + longitude + "</td></tr>");

				if (isSegmentPoint)
				{
					let segmentId = feature.get("segmentId");
					let segmentPointId = feature.get("segmentPointId");
					let distanceOnSegment = feature.get("distanceOnSegment");
					let distanceOnRoute = feature.get("distanceOnRoute");
					let timeOnSegment = feature.get("timeOnSegment");
					let timeOnRoute = feature.get("timeOnRoute");

					$table.append("<tr><td><span class='description'>Distance: </span></td><td>"
						+ self._beautifyNumber(Math.round(distanceOnSegment)) + " m / " + self._beautifyNumber(Math.round(distanceOnRoute)) + " m</td></tr>");
					$table.append("<tr><td><span class='description'>Time: </span></td><td>"
						+ Math.round(timeOnSegment) + " sec / " + Math.round(timeOnRoute) + " sec</td></tr>");
					$table.append("<tr><td><span class='description'>S - SP: </span></td><td>"
						+ (segmentId ? (segmentId + " - " + segmentPointId) : "") + "</td></tr>");
				}

				$data.append($table);

				$buttonWrapper.append($backEdit);
				$buttonWrapper.append($saveEdit);
				$buttonWrapper.append($edit);
				$buttonWrapper.append($remove);
				$buttonWrapper.append($removeNextOnSegment);
				$buttonWrapper.append($removeNextOnRoute);
				$footer.append($buttonWrapper);
				$wrapper.append($data);
				$wrapper.append($footer);

				return $wrapper;
			};

			this._getHeader$ = function ()
			{
				let feature = self._feature;

				//SegmentPoint                             
				let listTypeValues = feature.get("listTypeValues");
				let orderOnRoute = feature.get("orderOnRoute");
				let isSegmentPoint = wertyz.helper.isNumber(orderOnRoute);
				let isStop = listTypeValues.containsType(wertyz.point.PointType.STOPID);


				//Other
				let pointId = feature.get("id");

				let $header = $("<div></div>")
					.addClass("header");

				if (isStop)
				{
					if (isSegmentPoint)
					{
						let orderOnSegment = feature.get("orderOnSegment");
						let stopOrder = feature.get("segmentOrder");

						if (orderOnRoute !== 1)
							stopOrder++;

						let $span = $("<span/>")
							.addClass("stoporder")
							.text(stopOrder)
							.appendTo($header);
					}
					else
					{
						$header.append(listTypeValues.getType(wertyz.point.PointType.STOPID).value || "&nbsp;");
					}

					let stopName = listTypeValues.getTypeValue(wertyz.point.PointType.STOPNAME);
					if (stopName)
					{
						if (isSegmentPoint)
							$header.append("&nbsp;&nbsp;");
						else
							$header.append(" - ");
						$header.append(stopName);
					}
				}

				if (isSegmentPoint)
				{
					if (isStop)
						$header.append(" - ");

					let orderOnSegment = feature.get("orderOnSegment");

					$header.append(orderOnSegment + " / " + orderOnRoute);
				}

				if (!isSegmentPoint && !isStop)
					$header.append(pointId || "&nbsp;");

				return $header;
			};

			this._setCustomClasses = function ()
			{
				self._getContainer$().addClass("point");

				let listTypeValues = self._feature.get("listTypeValues");
				let zoom = self._map.getView().getZoom();

				if (listTypeValues.containsType(wertyz.point.PointType.STOPID))
				{
					self._getContainer$().addClass("stop");

					if (zoom >= 17)
						self._getContainer$().addClass("large");
				}
			};

			this._removeCustomClasses = function ()
			{
				self._getContainer$().removeClass("point");
				self._getContainer$().removeClass("stop");
				self._getContainer$().removeClass("large");
			};

			this._refreshHeader = function ()
			{
				let $header = self.point._getHeader$();
				$(self._popup.content).find(".header").replaceWith($header);
			};
		};

		this.route = new function ()
		{
			this._getContent$ = function ()
			{
				let feature = self._feature;
				let name = feature.get("routeName");

				let $wrapper = $("<div></div>");
				let $header = $("<div></div>")
					.addClass("header");

				$header.append(name);
				$wrapper.append($header);

				return $wrapper;
			};

			this._setCustomClasses = function ()
			{
				self._getContainer$().addClass("route");

				let subtype = self._feature.get("subtype");
				if (subtype)
					self._getContainer$().addClass(subtype);
			}

			this._removeCustomClasses = function ()
			{
				self._getContainer$().removeClass("route");
				self._getContainer$().removeClass("reality");
			}

			this.animation = new function ()
			{
				this._getContent$ = function ()
				{
					let vehicle = self._feature.get("activeVehicle");
					return self.vehicle._getContent$(vehicle);
				};

				this.update = function ()
				{
					self.vehicle.update();
				};
			};
		};

		this.trip = new function ()
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			this._getContent$ = function ()
			{
				let feature = self._feature;
				let trip = feature.get("object");

				let $wrapper = $("<div></div>");
				let $header = $("<div></div>")
					.addClass("header")
				let $footer = $("<div></div>")
					.addClass("footer");
				let $data = $("<div></div>")
					.addClass("data");
				let $table = $("<table class='tripinfobox'></table>")
					.addClass("content");

				if (self._isContentCollapsed)
					$table.addClass("collapsed");

				let $buttonWrapper = $("<div></div>")
					.addClass("buttons");

				let arrow = "&nbsp;&nbsp;\u2192&nbsp;&nbsp;";

				$header.append(trip.order);
				$header.append(arrow);
				$header.append(trip.line);
				$header.append(arrow);
				$header.append(trip.trip);
				$wrapper.append($header);

				$data.append(
					`<style>
						.tripinfobox .glyphicons {
							padding: 1px 2px;
							font-size: 15px;
							color: #009999;
						}
						.tripinfobox .glyphicons {
							margin-left: 2px;
						}
						#mapWrapper .ol-popup-content .header, #sidemap .ol-popup-content .header, #sideanimmap .ol-popup-content .header {
							background-color: #009999;
						}
					</style>`);

				$table.append("<tr><th></th><th colspan='2'><span class='description'>"
					+ wertyz.map.getLocale("infobox.plan") + "</span></th><th colspan='2'><span class='description'>"
					+ wertyz.map.getLocale("infobox.reality")
					+ "</span></th></tr>");

				$table.append("<tr><td colspan='5'>&nbsp;</td></tr>");

				$table.append("<tr><td><span class='description'>"
					+ wertyz.map.getLocale("infobox.licence") + " - "
					+ wertyz.map.getLocale("infobox.vin") + " - "
					+ wertyz.map.getLocale("infobox.obu") + ": </span></td><td class='plannedvehicle'>"
					+ (trip.plan.vehicle.licence || "")
					+ (trip.plan.vehicle.vin ? " - " + trip.plan.vehicle.vin : "")
					+ (trip.plan.vehicle.obu ? " - " + trip.plan.vehicle.obu : "")
					+ "<div class='toggleinfo' style='display: none;'>"
					+ `<table>
							<tr>
								<td>${wertyz.map.getLocale("infobox.driver")}:</td>
								<td>${(trip.plan.vehicle.driverNumber || "") + (trip.plan.vehicle.driverName ? (" - " + trip.plan.vehicle.driverName) : "")}</td>
							</tr>
							<tr>								
								<td>${wertyz.map.getLocale("infobox.order") + arrow + wertyz.map.getLocale("infobox.line") + arrow + wertyz.map.getLocale("infobox.trip")}:</td>
								<td>${(trip.plan.vehicle.order || "") + (trip.plan.vehicle.line ? arrow + trip.plan.vehicle.line : "") + (trip.plan.vehicle.trip ? arrow + trip.plan.vehicle.trip : "")}</td>
							</tr>
						</table>`
					+ "</div></td><td>"
					+ "<span class='glyphicons glyphicons-info-sign vehicleinfo' onclick='$(\".toggleinfo\").slideToggle()'></span>"
					+ "<span class='glyphicons glyphicons-map-marker vehiclemap'></span>"
					+ "</td><td>"
					+ (trip.licence || "")
					+ (trip.vin ? " - " + trip.vin : "")
					+ (trip.obu ? " - " + trip.obu : "") + "</td><td>"
					+ "<span class='glyphicons glyphicons-map-marker vehiclemap'></span></td></tr>");

				$table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.driver") + ": </span></td><td class='planneddriver'>"
					+ (trip.plan.driver.driverNumber || "")
					+ (trip.plan.driver.driverName ? (" - " + trip.plan.driver.driverName) : "") + "</td><td>"
					+ "<span class='glyphicons glyphicons-info-sign driverinfo'></span>"
					+ "<span class='glyphicons glyphicons-map-marker'></span></td><td>"
					+ (trip.driverNumber || "")
					+ (trip.driverName ? (" - " + trip.driverName) : "") + "</td><td>"
					+ "<span class='glyphicons glyphicons-map-marker'></span></td></tr>");

				// $table.append("<tr><td><span class='description'>"
				// 	+ wertyz.map.getLocale("infobox.order") + arrow
				// 	+ wertyz.map.getLocale("infobox.line") + arrow
				// 	+ wertyz.map.getLocale("infobox.trip") + ": </span></td><td>"
				// 	+ (trip.order || "")
				// 	+ (trip.line ? arrow + trip.line : "")
				// 	+ (trip.trip ? arrow + trip.trip : "") + "</td><td>"
				// 	+ (trip.order || "")
				// 	+ (trip.line ? arrow + trip.line : "")
				// 	+ (trip.trip ? arrow + trip.trip : "") + "</td></tr>");

				// $table.append("<tr><td><span class='description'>" + wertyz.map.getLocale("infobox.route") + ": </span></td><td>"
				// 	+ (trip.routeNumber || "") + "</td><td>"
				// 	+ (trip.routeNumber || "") + "</td></tr>");

				//console.log(trip);

				$table.find(".vehicleinfo").tooltip({
					"container": "body",
					"placement": "top",
					"html": true,
					"title": function ()
					{
						let tooltipHtml = `
							<style>
								.tooltip-inner {
									max-width: inherit !important;
									background-color: #009999 !important;
									font-size: 14px;
								}								
								.tooltip.top .tooltip-arrow {
									border-top-color: #009999 !important;
								}
								.tooltip-inner tr > td:first-child{
									color: #e2f2f1;
									text-align: right;									
								}	
								.tooltip-inner tr > td:not(:first-child){
									text-align: left;
									padding-left: 10px;
								}															
							</style>
							<table>
								<tr>
									<td>${wertyz.map.getLocale("infobox.driver")}:</td>
									<td>${(trip.plan.vehicle.driverNumber || "") + (trip.plan.vehicle.driverName ? (" - " + trip.plan.vehicle.driverName) : "")}</td>								
								</tr>
								<tr>								
									<td>${wertyz.map.getLocale("infobox.order") + arrow + wertyz.map.getLocale("infobox.line") + arrow + wertyz.map.getLocale("infobox.trip")}:</td>
									<td>${(trip.plan.vehicle.order || "") + (trip.plan.vehicle.line ? arrow + trip.plan.vehicle.line : "") + (trip.plan.vehicle.trip ? arrow + trip.plan.vehicle.trip : "")}</td>
								</tr>
							</table>`;

						return tooltipHtml;
					}
				});

				$table.find(".driverinfo").tooltip({
					"container": "body",
					"placement": "bottom",
					"html": true,
					"title": function ()
					{
						let tooltipHtml = `
							<style>
								.tooltip-inner {
									max-width: inherit !important;
									background-color: #009999 !important;
									font-size: 14px;
								}								
								.tooltip.bottom .tooltip-arrow {									
									border-bottom-color: #009999 !important;
								}
								.tooltip-inner tr > td:first-child{
									color: #e2f2f1;
									text-align: right;									
								}	
								.tooltip-inner tr > td:not(:first-child){
									text-align: left;
									padding-left: 10px;
								}															
							</style>
							<table>
								<tr>
									<td>${wertyz.map.getLocale("infobox.driver")}:</td>
									<td>${(trip.plan.driver.driverNumber || "") + (trip.plan.driver.driverName ? (" - " + trip.plan.driver.driverName) : "")}</td>								
								</tr>
								<tr>								
									<td>${wertyz.map.getLocale("infobox.order") + arrow + wertyz.map.getLocale("infobox.line") + arrow + wertyz.map.getLocale("infobox.trip")}:</td>
									<td>${(trip.plan.driver.order || "") + (trip.plan.driver.line ? arrow + trip.plan.driver.line : "") + (trip.plan.driver.trip ? arrow + trip.plan.driver.trip : "")}</td>
								</tr>
							</table>`;

						return tooltipHtml;
					}
				});

				$table.find(".vehiclemap").click(function ()
				{
					self.trip.event.call("vehiclemap", trip.obu);
				});

				$data.append($table);
				$footer.append($buttonWrapper);
				$wrapper.append($data);
				$wrapper.append($footer);

				return $wrapper;
			};

			this._setCustomClasses = function ()
			{
				// self.vehicle._removeCustomClasses();
				// self._getContainer$().addClass("vehicle");

				// let type = self._feature.get("type");
				// let stateColor = self._feature.get("stateColor");
				// let stateClass = wertyz.map.vehicle.state.getClass(stateColor);

				// if (type === "vehicle.animation")
				// 	self._getContainer$().addClass("animation");

				// self._getContainer$().addClass(stateClass);
			}

			this._removeCustomClasses = function ()
			{
				// self._getContainer$().removeClass("vehicle");

				// wertyz.map.vehicle.state.ColorMap.forEach(function (color, value)
				// {
				// 	let stateClass = wertyz.map.vehicle.state.getClass(value);

				// 	self._getContainer$().removeClass(stateClass);
				// });
			}

			this.update = function (feature)
			{
				let $popup = self._getContainer$();
				let $vehiclePopover = $popup.find(".vehicleinfo");
				let $driverPopover = $popup.find(".driverinfo");
				let vehiclePopoverVisible = $vehiclePopover.data('bs.tooltip') && $vehiclePopover.data('bs.tooltip').$tip && $vehiclePopover.data('bs.tooltip').$tip.is(':visible');
				let driverPopoverVisible = $driverPopover.data('bs.tooltip') && $driverPopover.data('bs.tooltip').$tip && $driverPopover.data('bs.tooltip').$tip.is(':visible');

				if (vehiclePopoverVisible || driverPopoverVisible)
				{
					console.log("visible");
					return;
				}

				if (feature)
					self._feature = feature;

				let newContent = self._getContent$();

				$(self._popup.content)
					.html(newContent);
				self.vehicle._setCustomClasses();
				self.refreshPosition();
			};
		};

		this._init = function ()
		{
			self._map.addOverlay(self._popup);
			self._controls();
			self._setResolutionChangeHandler();
		};

		this._getContainer$ = function ()
		{
			return $(this._popup.container);
		};

		this._getContent$ = function ()
		{
			let type = self._feature.get("type");

			switch (type)
			{
				case "vehicle":
					return self.vehicle._getContent$();
				case "vehicle.animation":
					return self.vehicle._getContent$();
				case "alarm":
					return self.alarm._getContent$();
				case "point":
					return self.point._getContent$();
				case "segmentPoint": //TODO return self.segmentPoint._getContent$();
					return self.point._getContent$();
				case "route":
					return self.route._getContent$();
				case "route.animation":
					return self.route.animation._getContent$();
				case "trip":
					return self.trip._getContent$();
				default:
					return "";
			}
		};

		this._set = function ()
		{
			let type = self._feature.get("type");

			self._removeCustomClasses();

			switch (type)
			{
				case "vehicle":
					self._displayMode = wertyz.map.popup.DisplayMode.VEHICLE;
					break;
				case "vehicle.animation":
					self._displayMode = wertyz.map.popup.DisplayMode.VEHICLE;
					break;
				case "alarm":
					self._displayMode = wertyz.map.popup.DisplayMode.ALARM;
					break;
				case "point":
					self._displayMode = wertyz.map.popup.DisplayMode.POINT;
					break;
				case "segmentPoint": //TODO DisplayMode.SEGMENTPOINT 
					self._displayMode = wertyz.map.popup.DisplayMode.POINT;
					break;
				case "route":
					self._displayMode = wertyz.map.popup.DisplayMode.ROUTE;
					break;
				case "route.animation":
					self._displayMode = wertyz.map.popup.DisplayMode.VEHICLE;
					break;
				case "trip":
					self._displayMode = wertyz.map.popup.DisplayMode.TRIP;
					break;
			}

			self._setCustomClasses();
		};

		this._setResolutionChangeHandler = function ()
		{
			let changeCounter = 0;

			self._map.getView().on("change:resolution", function (event)
			{
				if (!self.isShowed())
					return;

				if (self._displayMode !== wertyz.map.popup.DisplayMode.POINT
					&& self._displayMode !== wertyz.map.popup.DisplayMode.EDITPOINTTYPE)
					return;

				setTimeout(function (counter)
				{
					return function ()
					{
						if (changeCounter > counter)
							return;
						//console.log(changeCounter, counter);
						self._set();
						changeCounter = 0;
					}
				}(++changeCounter), 30);
			});
		};

		this._controls = function ()
		{
			let $closer = self._getContainer$().find(".ol-popup-closer");
			let $fontSizer = $("<a/>")
				.addClass("ol-popup-fontsizer")
				.addClass("fontsize")
				.addClass("glyphicons glyphicons-font")
				.attr("href", "#")
				.click(function ()
				{
					let $container = self._getContainer$();
					let duration = 100;
					let complete = function ()
					{
						if (self._popup.getPanMapIfOutOfView())
							self._popup.panIntoView();
					};

					if (!$container.hasClass("fontsize1") && !$container.hasClass("fontsize2") && !$container.hasClass("fontsize3"))
						$container.switchClass("", "fontsize1", duration, "", complete);
					else if ($container.hasClass("fontsize1"))
						$container.switchClass("fontsize1", "fontsize2", duration, "", complete);
					else if ($container.hasClass("fontsize2"))
						$container.switchClass("fontsize2", "fontsize3", duration, "", complete);
					else if ($container.hasClass("fontsize3"))
						$container.switchClass("fontsize3", "", duration, "", complete);
				})
				.insertBefore($closer);
			let $expander = $("<a/>")
				.addClass("ol-popup-expander")
				.addClass("glyphicons glyphicons-resize-full")
				.attr("href", "#")
				.attr("data-action", self._isContentCollapsed ? "expand" : "collapse")
				.click(function ()
				{
					self.switch(this);
				})
				.insertBefore($closer);

			$closer.click(function ()
			{
				self._isShowed = false;
			});
		};

		this._setCustomClasses = function ()
		{
			switch (self._displayMode)
			{
				case wertyz.map.popup.DisplayMode.VEHICLE:
					self.vehicle._setCustomClasses();
					break;
				case wertyz.map.popup.DisplayMode.ALARM:
					self.alarm._setCustomClasses();
					break;
				case wertyz.map.popup.DisplayMode.POINT:
					self.point._setCustomClasses();
					break;
				case wertyz.map.popup.DisplayMode.ROUTE:
					self.route._setCustomClasses();
				case wertyz.map.popup.DisplayMode.TRIP:
					self.trip._setCustomClasses();
					break;
			}
		};

		this._setClass = function (className)
		{
			self._getContainer$().addClass(className);
		}

		this._removeClass = function (className)
		{
			self._getContainer$().removeClass(className);
		}

		this._removeCustomClasses = function ()
		{
			self.vehicle._removeCustomClasses();
			self.alarm._removeCustomClasses();
			self.point._removeCustomClasses();
			self.route._removeCustomClasses();
		};

		this._beautifyNumber = function (number)
		{
			let numberString = number.toString();
			let remainder = numberString.length % 3;

			return (numberString.substr(0, remainder) + numberString.substr(remainder).replace(/(\d{3})/g, ' $1')).trim();
		};

		this.show = function (feature, pixel)
		{
			self._feature = feature;
			self._set();

			let geometry = feature.getGeometry();
			let $content = self._getContent$();
			let contentHtml = ""; //$content.prop('outerHTML');

			if (self._displayMode === wertyz.map.popup.DisplayMode.ROUTE)
				self._popup.show(geometry.getClosestPoint(self._map.getCoordinateFromPixel(pixel)), contentHtml);
			else
				self._popup.show(geometry.getCoordinates(), contentHtml);

			//Hack - popup only takes string which does not preserve complex jquery objects
			$(self._popup.content).html($content);

			if (self._popup.getPanMapIfOutOfView())
				self._popup.panIntoView();

			self._isShowed = true;
		};

		this.hide = function ()
		{
			self._popup.hide();
			self._feature = null;
			self._isShowed = false;
		};

		this.update = function (feature)
		{
			switch (self._displayMode)
			{
				case wertyz.map.popup.DisplayMode.VEHICLE:
					self.vehicle.update(feature);
					break;
				case wertyz.map.popup.DisplayMode.ALARM:
					self.alarm.update(feature);
					break;
				case wertyz.map.popup.DisplayMode.TRIP:
					self.trip.update(feature);
					break;
				default:
					break;
			}
		};

		this.setPosition = function (coordinates)
		{
			self._popup.setPosition(coordinates);
		};

		this.refreshPosition = function ()
		{
			let newCoordinates = self._feature.getGeometry().getCoordinates();
			self._popup.setPosition(newCoordinates);
		};

		this.follow = function (button)
		{
			//TODO odprasniť do namespacu vehicle

			let $button = $(button);
			let obu = parseInt($button.attr("data-obu"));

			if ($button.attr("data-action") === "follow")
			{
				wertyz.map.settings.vehicle.setFollowedObu(obu);
				$button.attr("data-action", "stopfollow")
					.addClass("selected");
				//.text(wertyz.map.getLocale("infobox.stop"));
				return;
			}

			wertyz.map.settings.vehicle.setFollowedObu(null);
			$button.attr("data-action", "follow")
				.removeClass("selected")
			//.text(wertyz.map.getLocale("infobox.follow"));
		};

		this.switch = function (button)
		{
			let $button = $(button);
			let $table = $button
				.siblings(".ol-popup-content")
				.find("table.content");

			if ($button.attr("data-action") === "expand")
			{
				$button.attr("data-action", "collapse")
					.removeClass("glyphicons-resize-full")
					.addClass("glyphicons-resize-small");
				$table.removeClass("collapsed");
				self._isContentCollapsed = false;

				if (self._popup.getPanMapIfOutOfView())
					self._popup.panIntoView();

				return;
			}

			$button.attr("data-action", "expand")
				.removeClass("glyphicons-resize-small")
				.addClass("glyphicons-resize-full");
			$table.addClass("collapsed");

			self._isContentCollapsed = true;
		};

		this.getFeature = function ()
		{
			return self._feature;
		};

		this.getType = function ()
		{
			if (!self._feature)
				return null;

			return self._feature.get("type");
		};

		this.getDisplayMode = function ()
		{
			return self._displayMode;
		};

		this.isShowed = function ()
		{
			return self._isShowed;
		};

		this._init();
	},

	DisplayMode:
	{
		"VEHICLE": 1,
		"ALARM": 2,
		"POINT": 3,
		"EDITPOINTTYPE": 4,
		"ROUTE": 5,
		"TRIP": 6
	}
};

wertyz.map.common =
{
	filter: new function ()
	{
		let self = this;

		this.apply = function (filter, objects)
		{
			let iterationOrder = self._getIterationOrder(filter);
			let filtered = [];

			for (let i = 0; i < objects.length; i++)
			{
				let obj = objects[i];
				let passedAll = true;

				for (let j = 0; j < iterationOrder.length; j++)
				{
					let propertyName = iterationOrder[j];
					let objValue = obj[propertyName];
					let filterValue = filter[propertyName];
					let some;

					if (Array.isArray(filterValue))
					{
						some = filterValue.some(function (value)
						{
							return objValue === value;
						});

						if (!some)
						{
							passedAll = false;
							break;
						}
					}
					else if (objValue !== filterValue)
						passedAll = false;
				}

				if (passedAll)
					filtered.push(obj);
			}

			return filtered;
		};

		this._getIterationOrder = function (filter)
		{
			//the most specific filters go first
			let sorted = [];
			let other = [];

			for (let key in filter)
			{
				if (filter[key].length)
					sorted.push(key);
				else
					other.push(key);
			}

			sorted = sorted.sort(function (a, b)
			{
				return filter[a].length - filter[b].length;
			});

			//no-arrays first
			return other.concat(sorted);
		};
	},

	selectCluster:
	{
		//only the last one ol.interaction.Select added on the map can be active, others are ignored
		layers: [],
		//styleFunctions: [],

		getOrCreateSelectClusterInteraction(map, clusterLayer, styleFunction)
		{
			wertyz.map.common.selectCluster.layers.push(clusterLayer);
			if (clusterLayer.get("name") === "Alarms")
				wertyz.map.common.selectCluster.getAlarmStyle = styleFunction;
			else
				wertyz.map.common.selectCluster.getTripStyle = styleFunction;
			//wertyz.map.common.selectCluster.styleFunctions[]

			let selectClusterInteraction = map.getInteractions().getArray().find((interaction) =>
			{
				return interaction.name === "SelectCluster";
			});

			if (!selectClusterInteraction)
			{
				selectClusterInteraction = new ol.interaction.SelectCluster(
					{
						name: "SelectCluster",
						layers: wertyz.map.common.selectCluster.layers,
						pointRadius: 40,
						animate: true,
						animationDuration: 200,
						featureStyle: function (feature, resolution)
						{// Style to draw feature when it springs apart
							if (feature.get('selectclusterlink'))
								return undefined;

							let featureType = feature.get("features")[0].get("type");
							let options =
							{
								iconCenter: true,
								iconAlpha: featureType === "alarm" ? 0.4 : 0.5
							}

							if (featureType === "alarm")
								return wertyz.map.common.selectCluster.getAlarmStyle(feature, resolution, options);
							return wertyz.map.common.selectCluster.getTripStyle(feature, resolution, options);
						},
						style: function (feature, resolution)
						{// Style to draw cluster when selected
							if (feature.get('selectclusterfeature'))
								return undefined;

							let featureType = feature.get("features")[0].get("type");
							//selectClusterInteraction.pointRadius = 100;                     

							if (featureType === "alarm")
								return wertyz.map.common.selectCluster.getAlarmStyle(feature, resolution);
							return wertyz.map.common.selectCluster.getTripStyle(feature, resolution);
						}
					});

				map.addInteraction(selectClusterInteraction);
			}

			return selectClusterInteraction;
		},

		getAlarmStyle: null,
		getTripStyle: null
	},

	connection:
	{
		state:
		{
			RgbMap:
				[
					"206, 206, 206", //Gray
					"255, 255, 255", //White
					"33, 224, 22", //Green
					"202, 43, 39", //Red
					"255, 121, 8", //Orange
					"206, 206, 206" //Gray
				],

			getColor: function (stateColorId)
			{
				let color = wertyz.map.common.connection.state.RgbMap[stateColorId];
				let opacity = wertyz.map.settings.common.getConnectionOpacity();

				if (stateColorId === 1)
					opacity += 0.3;

				color = "rgba(" + color + ", " + opacity + ")";

				return color;
			}
		},

		IConnectionProcessor: function ()
		{
			wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

			this._connectionLayer = null;
			this._connectionFeatures = new ol.Collection();

			this._baseInit = function ()
			{
				let connectionLayer = new ol.layer.Vector(
					{
						name: "Connections",
						source: new ol.source.Vector(
							{
								features: this._connectionFeatures
							}),
						zIndex: 5,
						style: this.getStyleForConnection
					});
				this._connectionLayer = connectionLayer;
				this._map.addLayer(connectionLayer);
			};

			this.addConnectionFeature = function (connectionFeature)
			{
				this._connectionFeatures.push(connectionFeature);
			};

			this.removeConnectionFeature = function (connectionFeature)
			{
				this._connectionFeatures.remove(connectionFeature);
			};

			this.getConnectionFeature = function (line, trip)
			{
				let feature = this._connectionFeatures.getArray().find((feature) =>
				{
					return feature.get("line") === line && feature.get("trip") === trip;
				});

				return feature;
			};

			this.getStyleForConnection = function (feature)
			{
				let stateColor = feature.get("stateColor");
				let color = wertyz.map.common.connection.state.getColor(stateColor || 0);
				let style = new ol.style.Style(
					{
						//LineString              
						stroke: new ol.style.Stroke({
							width: 4,
							color: color
						})
					});

				return style;
			};
		}
	},

	bindPopupOnProcessorGeometryChange: function (popupExtender, processor)
	{
		processor.event.on("featuregeometrychange", function (feature)
		{
			if (!popupExtender.isShowed() || popupExtender.getFeature() !== feature)
				return;

			popupExtender.refreshPosition();
		});
	}
};

wertyz.map.extender =
{
	controls: new function ()
	{
		//Abstract class
		this.Control = function ()
		{
			//abstract
			this.$button;

			this.setSelected = function (selected)
			{
				if (selected)
					this.$button.addClass("selected");
				else
					this.$button.removeClass("selected");
			};
		};

		this.FitControl = function (mapExtender, options)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "fit";

			let $element = $("<div/>")
				.addClass("fitmap ol-unselectable ol-control");

			let $button = $("<button/>")
				.addClass("glyphicons glyphicons-screenshot") //riflescope
				.click(function ()
				{
					$(this).toggleClass("selected");
					mapExtender.event.call("fitmap");
				})
				.appendTo($element);

			this.$button = $button;

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.FollowControl = function (mapExtender, options)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "follow";

			let $element = $("<div/>")
				.addClass("followmap ol-unselectable ol-control");

			let $button = $("<button/>")
				.addClass("glyphicons glyphicons-nearby-circle selected")
				.click(function ()
				{
					$(this).toggleClass("selected");
					mapExtender.event.call("followmap");
				})
				.appendTo($element);

			this.$button = $button;

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.HideControl = function (mapExtender)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "hide";

			let $element = $("<div/>")
				.addClass("hidemap ol-unselectable ol-control");

			let $button = $("<button/>")
				.addClass("glyphicons glyphicons-chevron-right")
				.click(function ()
				{
					$(this).toggleClass("selected");
					mapExtender.event.call("hidemap");
				})
				.appendTo($element);

			this.$button = $button;

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.MeasureControl = function (mapExtender)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "measure";

			let $element = $("<div/>")
				.addClass("measuremap ol-unselectable ol-control");

			let $button = $("<button/>")
				.addClass("glyphicons glyphicons-vector-path-curve")
				.click(function ()
				{
					$(this).toggleClass("selected");
					mapExtender.event.call("measuremap");
				})
				.appendTo($element);

			this.$button = $button;

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.AddPointControl = function (mapExtender)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "addpoint";

			let $element = $("<div/>")
				.addClass("addpointmap ol-unselectable ol-control");

			let $button = $("<button/>")
				.addClass("glyphicons glyphicons-pushpin")
				.click(function ()
				{
					$(this).toggleClass("selected");
					mapExtender.event.call("addpointmap");
				})
				.appendTo($element);

			this.$button = $button;

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.SearchControl = function (mapExtender, options)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			options = options || {};
			this.name = "search";

			let $element = $("<div/>")
				.addClass("searchmap ol-unselectable ol-control");
			let $input = $("<input/>");

			let itemClick = function ()
			{
				let $item = $(this);
				if ($item.hasClass("selected"))
					return;

				$item.addClass("selected");
				$item.siblings().removeClass("selected");

				let value = $input.val();
				if (!value)
					return;

				let parameters = getSearchParameters();
				mapExtender.event.call("searchmap", parameters);
			};

			let $div = $("<div/>")
				.addClass("searchtype")
				.appendTo($element);

			if (!options.searchControl || options.searchControl.vehicle !== false)
			{
				let $spanVehicle = $("<button/>")
					.attr("data-searchtype", wertyz.map.interaction.SearchType.VEHICLE)
					.attr("title", wertyz.map.getLocale("EFCControll.mapQuickSearch.vehicles"))
					.addClass("glyphicons glyphicons-bus vehicle selected")
					.click(itemClick)
					.appendTo($div);
			}

			if (!options.searchControl || options.searchControl.point !== false)
			{
				let $spanStop = $("<button/>")
					.attr("data-searchtype", wertyz.map.interaction.SearchType.POINT)
					.attr("title", wertyz.map.getLocale("EFCControll.mapQuickSearch.points"))
					//.attr("data-pointtype", wertyz.point.PointType.STOPID)
					.addClass("glyphicons glyphicons-cluster") //underground, person-walking
					.click(itemClick)
					.appendTo($div);
			}
			//let $spanInfotable = $("<button/>")
			//   .attr("data-searchtype", wertyz.map.interaction.SearchType.POINT)
			//   .attr("data-pointtype", wertyz.point.PointType.INFOTABLE)
			//   .addClass("glyphicons glyphicons-flag")
			//   .click(itemClick)
			//   .appendTo($div);
			if (!options.searchControl || options.searchControl.coordinates !== false)
			{
				let $spanCoordinates = $("<button/>")
					.attr("data-searchtype", wertyz.map.interaction.SearchType.COORDINATES)
					.attr("title", wertyz.map.getLocale("EFCControll.mapQuickSearch.coordinates"))
					.addClass("glyphicons glyphicons-map") //riflescope
					//.css("font-weight", "bold")
					.click(itemClick)
					.appendTo($div);
			}

			$div.find("button").first().addClass("selected");

			let getSearchParameters = function ()
			{
				let $button = $div.find("button.selected");
				let parameters =
				{
					searchType: parseInt($button.attr("data-searchtype")),
					searchText: $input.val()
				};

				if (parameters.searchType === wertyz.map.interaction.SearchType.POINT)
					parameters.pointType = parseInt($button.attr("data-pointtype"));

				return parameters;
			}

			$input.keyup(function (e)
			{
				let parameters = getSearchParameters();
				mapExtender.event.call("searchmap", parameters);
			})
				.appendTo($element);

			let $glyphSearch = $("<i/>")
				.addClass("glyphicon glyphicon-search")
				.appendTo($element);

			mapExtender._searchElement = $input.get(0);

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		this.InvalidGpsControl = function (mapExtender)
		{
			wertyz.helper.assignFunctionToObject(this, wertyz.map.extender.controls.Control);

			this.name = "invalidgps";

			let $element = $("<div/>")
				.addClass("invalidgps ol-unselectable ol-control");
			let $input = $("<input/>");

			$("<span/>")
				.addClass("title")
				.addClass("glyphicons glyphicons-satellite")
				.appendTo($element);

			wertyz.map.vehicle.state.ColorMap.forEach((vehicleColor, colorIndex) =>
			{
				if (colorIndex === 0)
					return;

				let src = wertyz.map.settings.contentUrl + "/" + wertyz.map.vehicle.state.getIconPath(colorIndex) + ".png";

				let $div = $("<div/>")
					.addClass("item")
					.click((e) =>
					{
						mapExtender.event.call("invalidgpsitemclick", colorIndex);
					})
					.appendTo($element);

				$("<img/>")
					.attr("src", src)
					.attr("title", wertyz.map.getLocale(wertyz.map.vehicle.state.ColorMap[colorIndex]))
					.appendTo($div);

				$("<span/>")
					.attr("data-statecolor", vehicleColor.toLowerCase())//TODO dat statecolor cislo
					.addClass("count")
					.appendTo($div);
			});

			this.setItem = function (key, count)
			{
				$element.find("div.item").find("span.count[data-statecolor='" + key + "']").text(count.toString());
			};

			ol.control.Control.call(this,
				{
					element: $element.get(0)
				});
		};

		wertyz.helper.inherit(this.FitControl, ol.control.Control);
		wertyz.helper.inherit(this.FollowControl, ol.control.Control);
		wertyz.helper.inherit(this.HideControl, ol.control.Control);
		wertyz.helper.inherit(this.MeasureControl, ol.control.Control);
		wertyz.helper.inherit(this.AddPointControl, ol.control.Control);
		wertyz.helper.inherit(this.SearchControl, ol.control.Control);
		wertyz.helper.inherit(this.InvalidGpsControl, ol.control.Control);
	},

	MapyCZLayer: function ()
	{
		let apiKey = '';
		let layers = [];

		const PREDEFINED_LAYERS = {
			BASIC: {
				title: 'Basic',
				get url () { 
					return `https://api.mapy.cz/v1/maptiles/basic/tiles.json?apikey=${apiKey}`
				}

			},

			OUTDOOR: {
				title: 'Outdoor',
				get url () {
					return `https://api.mapy.cz/v1/maptiles/outdoor/tiles.json?apikey=${apiKey}`
				}
			},

			WINTER: {
				title: 'Winter',
				get url ()  {
					return `https://api.mapy.cz/v1/maptiles/winter/tiles.json?apikey=${apiKey}`
				}
			},
			
			AERIAL: {
				title: 'Aerial',
				get url () { 
					return `https://api.mapy.cz/v1/maptiles/aerial/tiles.json?apikey=${apiKey}`
				}
			}
		}

		this.setAPIKey = function(key) {
			apiKey = key;
		}

		this.setPredefinedLayers = function(...layersSelected) {
			let visible = true;
			console.log(apiKey);
			layersSelected.forEach(layer => {
				for(key in PREDEFINED_LAYERS) {
					if(layer === key) {
						layers.push(new ol.layer.Tile({
							title: PREDEFINED_LAYERS[key].title,
							visible: visible,
							type: 'base',
							source: new ol.source.TileJSON({
								url: PREDEFINED_LAYERS[key].url
							})
						}));

						visible = false;
					}
				}
			})
		}

		this.getLayers = function () {
			return layers;
		}

		this.getLayerGroup = function () {
			return new ol.layer.Group({
				title: 'LayerGroup',
				layers: layers
			})
		}
	},

	Extender: function (targetElementId, options)
	{
		wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

		let self = this;
		this._map = null;
		this._containerId = targetElementId;
		this._searchElement = null;
		this._controlExtensions = [];

		this._init = function (options)
		{
			let defaultControls = {
				zoom: true,
				rotate: false,
				attribution: false				
			};

			let createFullScreenControl = !options || options.fullScreenControl !== false;

			if (options && options.fitControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.FitControl(self));
			if (options && options.followControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.FollowControl(self));
			if (options && options.measureControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.MeasureControl(self));
			if (options && options.addPointControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.AddPointControl(self));
			if (options && options.hideControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.HideControl(self));
			if (options && options.searchControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.SearchControl(self, options));
			if (options && options.invalidGpsControl)
				self._controlExtensions.push(new wertyz.map.extender.controls.InvalidGpsControl(self, options));
			if (options && options.zoomControl === false)
				defaultControls.zoom = false;
			if (options && options.attributionControl)
				self._controlExtensions.push(new ol.control.Attribution());
			if (createFullScreenControl)
				self._controlExtensions.push(new ol.control.FullScreen());			

			let map = new ol.Map(
				{
					target: self.getContainerId(),
					controls: ol.control.defaults(defaultControls).extend(self._controlExtensions),
					interactions: ol.interaction.defaults(
					{					
						altShiftDragRotate: false, 
						pinchRotate: false
					}),
					layers: [
						options.tileLayer === undefined ? 
						new ol.layer.Tile({
							name: "Tile",
							source: new ol.source.OSM(
								{
									crossOrigin: null
								})
						})
						:
						options.tileLayer
					],
					view: new ol.View({
						center: ol.proj.fromLonLat([0.0, 0.0]),
						zoom: 2, //13,
						constrainResolution: true,
						enableRotation: false
					}),
					loadTilesWhileAnimating: true,
					loadTilesWhileInteracting: true
				});

            if (!options || options.scaleControl !== false)
			    map.addControl(new ol.control.ScaleLine());

			if (createFullScreenControl)
				self.setFullScreenBehavior();

			self._map = map;
		};

		this.setSearchBoxValue = function (value)
		{
			self._searchElement.value = value;
		};

		this.setCursor = function (cursorType)
		{
			$(self._map.getTargetElement()).css("cursor", cursorType);
		};

		/*Eventify public abstract method for custom-defined triggering*/
		this.showCoordinates = function (coordinates)
		{
			self.event.call("showcoordinates", coordinates);
		};

		/*Eventify public abstract method for custom-defined triggering*/
		this.clearCoordinates = function ()
		{
			self.event.call("clearcoordinates");
		};

		this.center = function (feature)
		{
			let coordinates = feature.getGeometry().getCoordinates();

			self._map.getView().setCenter(coordinates);
		};

		this.centerPan = function (feature, options)
		{
			let coordinates = feature.getGeometry().getCoordinates();
			let duration = (options && options.duration) ? options.duration : 200;

			self._map.getView().animate({ center: coordinates, duration: duration });
		};

		this.loader = function (action)
		{
			self.event.call("loading", action);
		};

		//TODO hodiť asi do globálneho? 
		//TODO urobiť metódu getZIndex
		this.organizeLayers = function ()
		{
			let zIndexOrder =
				[
					"RealityRoutes",
					"PlanRoutes",
					"SimplePoints",
					"StopPoints",
					"Connections",
					"AnimationTrips",
					"Trips",
					"Vehicles",
					"Alarms",
					"PinPoint"
				];

			zIndexOrder.forEach(function (layerName, index)
			{
				let layer = self.getLayerByName(layerName);
				if (!layer)
					return;

				layer.setZIndex(index + 1);
			});
		};

		this.getMap = function ()
		{
			return self._map;
		};

		this.getZoom = function ()
		{
			return self._map.getView().getZoom();
		};					

		this.getContainerId = function ()
		{
			return self._containerId;
		};

		this.getContainer$ = function ()
		{
			return $("#" + self.getContainerId());
		};

		this.getLayerByName = function (name)
		{
			let layers = self._map.getLayers().getArray();

			for (let i = 0; i < layers.length; i++)
			{
				if (layers[i].get("name") !== name)
					continue;
				return layers[i];
			}
		};

		this.getSearchText = function ()
		{
			if (!self._searchElement)
				return null;

			return self._searchElement.value;
		};

		this.getControl = function (controlName)
		{
			return self._controlExtensions.find(function (c)
			{
				return c.name === controlName;
			});
		};

		this.addControl = function (controlName, options)
		{
			let control;

			switch (controlName)
			{
				case "fit":
					control = new wertyz.map.extender.controls.FitControl(self, options);
					break;
				case "follow":
					control = new wertyz.map.extender.controls.FollowControl(self, options);
					break;
				case "hide":
					control = new wertyz.map.extender.controls.HideControl(self, options);
					break;
				case "measure":
					control = new wertyz.map.extender.controls.MeasureControl(self, options);
					break;
				case "addpoint":
					control = new wertyz.map.extender.controls.AddPointControl(self, options);
					break;
				case "searchmap":
					control = new wertyz.map.extender.controls.SearchControl(self, options);
					break;
				case "invalidgps":
					control = new wertyz.map.extender.controls.InvalidGpsControl(self, options);
					break;
			}

			self._controlExtensions.push(control);
			self._map.addControl(control);
		};

		this.setZoom = function (zoom)
		{
			return self._map.getView().setZoom(zoom);
		};		

		this.fit = function(geometryOrExtent, options)
        {           
            self._map.getView().fit(geometryOrExtent, options);
        };

		this.setFullScreenBehavior = function ()
		{
			let $triggerElement = $(".ol-full-screen");
			let $mapContainer = self.getContainer$();
			let width = $mapContainer.css("width");
			let height = $mapContainer.css("height");
			let maxWidth = $mapContainer.css("max-width");
			let maxHeight = $mapContainer.css("max-height");
			let isFullScreenMode = false;
			let isClick = false;

			let triggerClick = function ()
			{
				if (isFullScreenMode)
				{
					$mapContainer.css("position", "");
					$mapContainer.css("width", width);
					$mapContainer.css("height", height);
					$mapContainer.css("max-width", maxWidth);
					$mapContainer.css("max-height", maxHeight);
				}
				else
				{
					$mapContainer.css("position", "fixed");
					$mapContainer.css("width", "100%");
					$mapContainer.css("height", "100%");
					$mapContainer.css("max-width", "");
					$mapContainer.css("max-height", "");
				}

				isFullScreenMode = !isFullScreenMode;
			};

			$triggerElement.on("click", () =>
			{
				isClick = true;
				triggerClick();
			});

			let browserNative = () =>
			{
				let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
				if (fullscreenElement || isClick)
				{
					isClick = false;
					return;
				}

				$triggerElement.click();
				self.getMap().updateSize();
			}

			$(document).on("fullscreenchange", browserNative);
			$(document).on("webkitfullscreenchange", browserNative);
			$(document).on("mozfullscreenchange", browserNative);
			$(document).on("MSFullscreenChange", browserNative);
		}

		this._init(options);
	}
};

wertyz.map.helper = 
{
	getExtent: function(features) 
	{
		const extent = new ol.extent.createEmpty();

		features.forEach(feature => 
		{					
			const featureExtent = feature.getGeometry().getExtent();
			ol.extent.extend(extent, featureExtent);
		});

		return extent;
	}
};

wertyz.map.getLocale = function (key)
{
	return wertyz.applicationSettings.localization.get(key);
};