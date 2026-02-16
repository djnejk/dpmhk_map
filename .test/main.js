/// <reference path="../../shared/js/wertyz.js" />
/// <reference path="../../shared/map/js/wertyz.map.js" />
/// <reference path="../../shared/map/js/waitMe.min.js" />
/// <reference path="../../shared/map/js/ol.js" />

window.simpleEvents = new EventTarget();

$(document).ready(function()
{
    const wh = wertyz.helper;
    const $sidebar = $("#sidebar");
    const $content = $sidebar.find(".sidebar__content");
    const $searchBar = $sidebar.find(".search-bar");
    const $searchBarMode = $searchBar.find(".search-bar__icon");
    const $searchBox = $searchBar.find(".search-bar__input");
    const $suggestions = $sidebar.find(".list-suggestions");
    const $searchResultMain = $sidebar.find(".search-result--main");
    const $searchResultDetail = $sidebar.find(".search-result--detail");

    const minZoomStopPlatforms = 17;
    const minZoomStops = 14;

    const isMztmSkin = pis.settings.skin === "mztm";    
    const vehiclesOnStart = pis.settings.vehiclesOnStart;

    const mapActionHandlers = {};
    wh.assignFunctionToObject(mapActionHandlers, wertyz.class.Eventify);

    const view = new pis.View();

    /*
    const mapyCZ = new wertyz.map.extender.MapyCZLayer();
    mapyCZ.setAPIKey(API_KEY);
    mapyCZ.setPredefinedLayers('BASIC', 'AERIAL');
    */

    const mapExtender = new wertyz.map.extender.Extender("map",
    {
        fitControl: true,
        attributionControl: true,
        //tileLayer: mapyCZ.getLayerGroup()
    });

    const layerSwitcher = new LayerSwitcher({
        groupSelectStyle: 'group',
      });
      
      // we add our layer switcher to the map
      mapExtender.getMap().addControl(layerSwitcher);

    const map = mapExtender.getMap();
    const vehicleProcessor = new pis.map.VehicleProcessor(mapExtender,
    {
        cluster: true,
        //clusterDistance: 20,
        minZoom: !vehiclesOnStart ? 14 : null,
        colorIcons: isMztmSkin
    });
    const stopProcessor = new pis.map.StopProcessor(mapExtender,
    {
        cluster: true,
        clusterDistance: 40,
        clusterMainColor: isMztmSkin ? "#d6006f" : "", //"#d6006fcc"
        //clusterStrokeColor: "#d6006f44",
        mztm: isMztmSkin,
        //minZoom: minZoomStops,       
        minZoomStops: minZoomStops,
        minZoomStopPlatforms: minZoomStopPlatforms,        
        //maxZoomCluster: minZoomStops
    });
    const routeProcessor = new pis.map.RouteProcessor(mapExtender, 
    {      
        colorIcons: isMztmSkin
    });

    const placeProcessor = new pis.map.PlaceProcessor(mapExtender, null);

    const vehiclePopup = createVehiclePopup(map);   
    const popup = createStopPopup(map);
    const stopPopupStart = createStopPopup(map);
    const stopPopupEnd = createStopPopup(map);
    const fitDuration = 300;
    const mapAjaxCalls = {
        refreshVehiclesCallback: null,
        stopDeparturesTimeout: null
    };

    const geolocationProcessor = new pis.map.GeolocationProcessor(mapExtender, {
        fit: true,
        color: pis.settings.themeColor,
        mapBox: pis.settings.mapBboxCoordinates
    });

    //mapExtender.event.on('fitmap', geolocationProcessor.fitFeature());
    //wh.dom.setMaxHeightFromOffset("map");    
    
    if (isMztmSkin)
    {
        addZtmAttributionOverlay();
    }

    initHeaderLists();
    initSearchBox();
    createMapListeners();

    $(document).click(() =>
    {
        toggleSuggestions(false);
    });

    waitMe($sidebar, "show",
    {
        text: "Loading timetables ..."
    });

    //Refreshing vehicles collection in regular timeOut
    const axGetAllRtdVehicles_Loop = function()
    {
        return axGetAllRtdVehicles()
            .done((data) =>
            {
                if (!data || !data.vehicles || !data.vehicles.length)
                    return;

                //POZOR hack pre polscie
                const oldVehicles = pis.data.vehicles;

                const browserActualTime = Math.floor(new Date().getTime() / 1000);
                const actualTime = data.actualTimestamp > browserActualTime ? browserActualTime : data.actualTimestamp;


                pis.data.vehicles = data.vehicles.filter(v =>
                {
                    const latLongFilter = v.lo < v.la; //pre Polsko
                    const onRouteFilter = v.ln && v.tn && v.rn;
                    const vehicleTimestamp = wh.getDateFromShiftedUTCString(v.l).getTime();
                    const communicationFilter = (actualTime - vehicleTimestamp / 1000) / 60 <= 5;

                    //debugger;
                    return latLongFilter && onRouteFilter && communicationFilter;
                });
                

                //TODO do globalnej fcie
                //console.log(oldVehicles.length, pis.data.vehicles.length, oldVehicles === pis.data.vehicles);       
                if (oldVehicles)
                {//compute azimuth from gps position change                    
                    pis.data.vehicles.forEach(vehicle => 
                    {
                        if(pis.settings.mapVehicleLineToLineNumberText && vehicle.ln)
                        {
                            if(pis.data.lineNumberMap.has(+vehicle.ln))
                            {
                                vehicle.lnh = pis.data.lineNumberMap.get(+vehicle.ln).lineNumberText;
                            }
                        }

                        const oldVehicle = oldVehicles.find(v => v.vid === vehicle.vid);
                                               
                        if (!oldVehicle)
                            return;

                        if (vehicle.la === oldVehicle.la && vehicle.lo === oldVehicle.lo)
                        {
                            vehicle.az = oldVehicle.az;
                            return;
                        }

                        //azimuth in radians
                        vehicle.az = wertyz.gps.bearing(
                            oldVehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR,
                            oldVehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR,
                            vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR,
                            vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR
                        );
                        //console.log(vehicle.az);                      
                    });
                }
                //console.log(pis.data.vehicles.map(v => v.az).filter(az => az !== 0));
                axGetAllRtdVehicles_Loop.event.call("refresh", pis.data.vehicles, oldVehicles);
            })
            .always(() =>
            {
                setTimeout(axGetAllRtdVehicles_Loop, 5000);
            });
    };
    wh.assignFunctionToObject(axGetAllRtdVehicles_Loop.event = {}, wertyz.class.Eventify);

    if(!pis.settings.parking)
    {
        const promise3 = axGetLinesWithRoutes().always(() => {

        const promise1 = axGetAllRtdVehicles_Loop();
        const promise2 = axGetAllPlatforms();//axGetAllStops();

        Promise.all([promise1, promise2/*, promise3*/])
            .then(resolve =>
            {
                //const vehicles = resolve[0].vehicles;
                const stops = resolve[1].platforms;
                const groupedStops = createMapOfGroupedStops(stops);

                stopProcessor.setStops(stops, groupedStops);
                vehicleProcessor.setVehicles(pis.data.vehicles);
    
                if(!geolocationProcessor.getIsGeolocation() || !geolocationProcessor.isCoordinatesInsideBox(pis.settings.mapBboxCoordinates)) 
                {
                    if(pis.settings.fitPlatformId)
                    {
                        stopProcessor.fitStops([+pis.settings.fitPlatformId],
                        {
                            maxZoom: Math.max(13, mapExtender.getZoom()),
                            duration: fitDuration,
                            padding: getMapPadding()
                        });
                    }
                    else
                    {
                        stopProcessor.fit();
                    }
                }

                mapAjaxCalls.refreshVehiclesCallback = axGetAllRtdVehicles_Loop.event.on("refresh", (vehicles) =>
                {
                    vehicleProcessor.setVehicles(vehicles);
                });
            })
            .catch((error1, error2, error3) =>
            {
                console.log(error1, error2/*, error3*/);
            })
            .finally(() =>
            {
                $searchBox.focus();
                waitMe($sidebar, "hide");
            });
        })
    }
    else
    {
        axGetAllPlaces().then(res => {
            placeProcessor.setPlaces(res.data.filter(place => place.points.length === 1));
            placeProcessor.fit();
        })
    }

    /********************************************** DEV!!! ***************************************************/

    //const devLineId = 44673;
    //const devRouteId = 461;
    //showSelectedLine(pis.data.getLine(devLineId));
    //showSelectedRoute(pis.data.getLine(devLineId), pis.data.getRoute(devLineId, devRouteId), pis.data.dev_stops, [
    //{}]);
    //mapProcessor.setRoutes(pis.data.dev_routes.filter(r => r.id === devRouteId));
    //mapProcessor.fit(
    //{
    //    padding: getMapPadding()
    //});

    /*********************************************************************************************************/



    function initHeaderLists()
    {
        //Lines, Stops
        const $listSearchType = $sidebar.find(".list-header__search-type");
        $listSearchType.find(".list-header__item-button")
            .click(function()
            {
                const $this = $(this);

                // $listSearchType.find(".list-header__item-button")
                //     .removeClass("list-header__item-button--selected");
                $this.toggleClass("list-header__item-button--selected");

                const searchType = getSelectedSearchType();

                switch (searchType)
                {
                    case pis.SearchType.LINES:
                        $searchBarMode.addClass("glyphicons-left-indent");
                        $searchBarMode.removeClass("glyphicons-menu-hamburger");
                        $searchBarMode.removeClass("glyphicons-flag");
                        $searchBox.attr("placeholder", local("sidebar.search-in-lines"));
                        break;
                    case pis.SearchType.STOPS:
                        $searchBarMode.addClass("glyphicons-flag");
                        $searchBarMode.removeClass("glyphicons-menu-hamburger");
                        $searchBarMode.removeClass("glyphicons-left-indent");
                        $searchBox.attr("placeholder", local("sidebar.search-in-stops"));
                        break;
                    case pis.SearchType.LINES | pis.SearchType.STOPS:
                        $searchBarMode.addClass("glyphicons-menu-hamburger");
                        $searchBarMode.removeClass("glyphicons-left-indent");
                        $searchBarMode.removeClass("glyphicons-flag");
                        $searchBox.attr("placeholder", local("sidebar.search-in-all-timetables"));
                        break;
                    case pis.SearchType.ALL:
                        $searchBarMode.addClass("glyphicons-menu-hamburger");
                        $searchBarMode.removeClass("glyphicons-left-indent");
                        $searchBarMode.removeClass("glyphicons-flag");
                        $searchBox.attr("placeholder", local("sidebar.search-in-all-timetables"));
                        break;
                }

                if (view.hasState(view.State.SEARCH_RESULT))
                {
                    if (view.hasState(view.State.SEARCH_RESULT_CITY))
                    {
                        showSearchList(pis.SearchType.CITY, view.getReferenceValue());
                    }
                    else
                    {
                        showSearchList(searchType, view.getReferenceValue());
                    }
                }

                //$searchBox.val("");
                $searchBox.focus();
                toggleSuggestions(false);
            });

        //Buses, Trams, Trolleys
        const $listTransportType = $sidebar.find(".list-header__transport-type");
        $listTransportType.find(".list-header__item-button")
            .click(function()
            {
                const $this = $(this);

                // $listTransportType.find(".list-header__item-button")
                //     .removeClass("list-header__item-button--selected");
                $this.toggleClass("list-header__item-button--selected");

                const searchType = getSelectedSearchType();
                const transportType = getSelectedTransportType();

                //console.log(view.getReferenceValue());
                if (transportType === pis.TransportType.ALL)
                {
                    stopProcessor.setStops(pis.data.stops, pis.data.stopsGroupedByName);
                }
                else
                {
                    //TODO urobit jednotnu metodu na filter pre transport type
                    const stops = pis.data.stops.filter(stop => transportType & pis.transportType.getAllForStop(stop.platformKind));
                    const groupedStops = createMapOfGroupedStops(stops);
                    stopProcessor.setStops(stops, groupedStops);

                    //TODO manazovat zobrazenia, pamatat si co je zobrazene                    
                    if (stopProcessor.isShown() && !stops.some(stop => stop.id === popup.getReferenceId()))
                    {
                        popup.hide();
                    }
                }

                if (view.hasState(view.State.SEARCH_RESULT))
                {
                    if (view.hasState(view.State.SEARCH_RESULT_CITY))
                    {
                        showSearchList(pis.SearchType.CITY, view.getReferenceValue());
                    }
                    else
                    {
                        showSearchList(searchType, view.getReferenceValue());
                    }

                    return;
                }

                //$searchBox.val("");
                $searchBox.focus();
                toggleSuggestions(false);
            });
    }

    function initSearchBox()
    {
        //$searchBox.attr("placeholder", local("sidebar.search-in-all-timetables"));

        $searchBarMode.attr("data-search-type", pis.SearchType.ALL);

        $searchBar
            .find(".search-bar__clear")
            .click(function()
            {
                $searchBox.val("");
                $searchResultMain.empty();
                $searchResultDetail.empty();
                resetView();
            });

        $searchBox.on("keyup paste", function(e)
        {
            const $this = $(this);
            const searchText = $this.val();
            const isEnter = e.which === 13;
            let searchType = getSelectedSearchType();
            //$this.removeClass("search-bar__input--activeresult");
            //$suggestions.empty();

            if (!searchText)
            {
                toggleSuggestions(false);
                return;
            }

            // if (searchType === pis.SearchType.ALL && !wh.isNumber(searchText[0]))
            // { //Laco to takto chcel
            //     searchType = pis.SearchType.STOPS;
            // }

            if (isEnter)
            {                
                $suggestions.empty();
                toggleSuggestions(false);
                view.set(view.State.SEARCH_RESULT_TEXT, searchText);
                showSearchList(searchType, searchText);
                return;
            }
    
            fillSuggestions(searchType, searchText);
        });

        $searchBox.focus();
    }   

    async function fillSuggestions(searchType, searchText)
    {
        const suggestions = [];
        const transportType = getSelectedTransportType();
        const itemCount = (searchType === pis.SearchType.ALL ? 3 : 6);
        const cities = filterCities(searchText);        
        //TODO funkcia na create suggestion item
        if (searchText.length >= 3)
        {
            await axGetGeoLocation(searchText)
                .done((data) => 
                {
                    //console.log(data);
                    if (data && data.features && data.features.length)
                    {
                        const geoLocation = data.features[0];
                        const $li = createSuggestionItem$(
                        {
                            type: "geoLocation",
                            geoLocation: geoLocation
                        })
                        .click(() =>
                        {
                            //view.set(view.State.SEARCH_RESULT_CITY, city);
                            //$searchBox.val(city);
                            //resetMap();
                            toggleSuggestions(false);
                            //showSearchList(pis.SearchType.CITY, city);

                            const position = ol.proj.fromLonLat([geoLocation.geometry.coordinates[0], geoLocation.geometry.coordinates[1]]);
                            const extent = ol.extent.boundingExtent([position]);
                            mapExtender.fit(extent,
                            {
                                maxZoom: minZoomStopPlatforms,
                                duration: fitDuration,
                                padding: getMapPadding()
                            });

                        });
                        //.appendTo($suggestions);
                        suggestions.push($li);
                        //console.log("A");
                    }
                });

                //console.log("B");
        }

        if (cities.length)
        {
            const city = cities[0].name;
            const $li = createSuggestionItem$(
                {
                    type: "city",
                    city: city
                })
                .click(() =>
                {
                    view.set(view.State.SEARCH_RESULT_CITY, city);
                    $searchBox.val(city);
                    resetView();
                    toggleSuggestions(false);
                    showSearchList(pis.SearchType.CITY, city);
                });
                //.appendTo($suggestions);

                suggestions.push($li);
        }

        if (searchType & pis.SearchType.LINES)
        {
            const passedLines = filterLinesZTM(searchText, transportType);

            for (let i = 0; i < Math.min(itemCount, passedLines.length); i++)
            {
                const line = passedLines[i];
                const $li = createSuggestionItem$(
                    {
                        type: "line",
                        line: line
                    })
                    .click(() =>
                    {
                        $searchBox.val(line.lineNumberText + "   " + pis.data.getLineName(line));
                        //resetMap();
                        toggleSuggestions(false);
                        showSelectedLine(line);
                    });
                    //.appendTo($suggestions);

                    suggestions.push($li);
            }
        }

        if (searchType & pis.SearchType.STOPS)
        {
            const passedStops = filterStops(searchText, transportType);

            for (let i = 0; i < Math.min(itemCount, passedStops.length); i++)
            {
                const stop = passedStops[i];
                const $li = createSuggestionItem$(
                    {
                        type: "stop",
                        stop: stop
                    })
                    .click(() =>
                    {
                        view.set(view.State.STOP, stop.id); //TODO ma byt stop.name
                        $searchBox.val(stop.name);
                        resetView();
                        toggleSuggestions(false);
                        showSelectedStop(stop.name);
                    });
                    //.appendTo($suggestions);

                    suggestions.push($li);
            }
        }

        $suggestions.empty();

        if (suggestions.length)
        //if ($suggestions.find("li").length)
        {            
            $suggestions.append(suggestions);
            toggleSuggestions(true);
            //console.log("C");
            return;
        }
        
        toggleSuggestions(false);
    }

    function toggleSuggestions(show)
    {
        const $searchPopup = $sidebar.find("div.search-popup");

        if (show)
        {
            $searchPopup.show();
            $searchBox.addClass("search-bar__input--activeresult");
        }
        else
        {
            $searchPopup.hide();
            $searchBox.removeClass("search-bar__input--activeresult");
        }
    }

    function createSuggestionItem$(options)
    {
        const $li = $("<li/>")
            .addClass("list-suggestions__item");
        const $left = $("<div/>")
            .addClass("list-suggestions__item-child list-suggestions__type")
            .appendTo($li);
        const $right = $("<div/>")
            .addClass("list-suggestions__item-child list-suggestions__name")
            .appendTo($li);
        const $icon = $("<span/>")
            .addClass("list-suggestions__icon")
            .appendTo($left);
        const $text = $("<span/>")
            .addClass("list-suggestions__text")
            .appendTo($right);

        switch (options.type)
        {
            case "line":
                $icon.addClass("glyphicons glyphicons-left-indent");
                $text.text(pis.data.getLineName(options.line));
                const $textBold = $("<span/>")
                    .addClass("list-suggestions__text")
                    .text(options.line.lineNumberText)
                    .prependTo($right);
                break;
            case "stop":
                $icon.addClass("glyphicons glyphicons-flag");
                $text.text(options.stop.name);
                break;
            case "city":
                $icon.addClass("list-suggestions__icon--highlight");
                $icon.addClass("glyphicons glyphicons-building");
                $text.text(options.city);
                break;
            case "geoLocation":
                $icon.addClass("list-suggestions__icon--highlight");
                $icon.addClass("glyphicons glyphicons-map-marker");
                $text.text(options.geoLocation.properties.name);
                break;
        }

        return $li;
    }

    function getSelectedSearchType()
    {
        let searchType = 0;

        $sidebar
            .find(".list-header__search-type")
            .find(".list-header__item-button--selected")
            .each((index, item) =>
            {
                searchType |= parseInt($(item).attr("data-search-type"));
            });

        if (!searchType)
            return pis.SearchType.ALL;

        return parseInt(searchType);
    };

    function getSelectedTransportType()
    {
        let transportType = 0;

        $sidebar
            .find(".list-header__transport-type")
            .find(".list-header__item-button--selected")
            .each((index, item) =>
            {
                transportType |= parseInt($(item).attr("data-transport-type"));
            });

        if (!transportType)
            return pis.TransportType.ALL;

        return parseInt(transportType);
    };

    function showSearchList(searchType, searchText)
    {
        const transportType = getSelectedTransportType();

        $searchResultDetail.hide();
        $searchResultMain.empty();
        $searchResultMain.show();

        if (searchType & pis.SearchType.LINES)
        {            
            const passedLines = filterLinesZTM(searchText, transportType);
            //const passedLines = filterLines(searchText, transportType);
            //passedLines.sort(wh.comparable("number")); //TODO zjednotit vsade

            for (let i = 0; i < passedLines.length; i++)
            {
                const line = passedLines[i];
                const transportType = pis.transportType.getForLine(line.lineKind);

                const $resultHeader = $("<div/>")
                    .addClass("result__item")
                    .click(function()
                    {
                        $searchBox.val(line.lineNumberText +
                            "   " + pis.data.getLineName(line));

                        //resetMap();
                        showSelectedLine(line);
                    })
                    .appendTo($searchResultMain);

                const $info = $("<div/>")
                    .addClass("result__info")
                    .appendTo($resultHeader);

                const $left = $("<div/>")
                    .appendTo($info);

                const $label = createLineHeaderInfoLabel(line.lineNumberText)
                    .appendTo($left);

                const $right = $("<div/>")
                    .addClass("result__info-description")
                    .appendTo($info);

                const $descriptionMain = $("<span/>")
                    .addClass("result__info-description-main")                 
                    .html(pis.data.getLineName(line))
                    .appendTo($right);

                const $newLine = $("<br/>")
                    .appendTo($right);

                const $descriptionSecondary = $("<span/>")
                    .addClass("result__info-description-secondary")
                    .text(line.name)
                    .appendTo($right);
            }
        }

        if (searchType & pis.SearchType.STOPS || searchType === pis.SearchType.CITY)
        {
            let passedStops;

            if (searchType === pis.SearchType.CITY)
            {
                passedStops = pis.data.distinctStops.filter(stop => (stop.city === searchText) 
                    && (transportType & pis.transportType.getAllForStop(stop.platformKind)));
            }
            else
            {

                passedStops = filterStops(searchText, transportType);
            }

            //passedStops.sort(wh.comparable("name")); //TODO zjednotit vsade

            for (let i = 0; i < passedStops.length; i++)
            {
                const stop = passedStops[i];

                const $resultHeader = $("<div/>")
                    .addClass("result__item")
                    .click(function()
                    {
                        view.set(view.State.STOP, stop.id);
                        $searchBox.val(stop.name);

                        resetView();
                        showSelectedStop(stop.name);
                    })
                    .appendTo($searchResultMain);

                const $info = $("<div/>")
                    .addClass("result__info")
                    .appendTo($resultHeader);

                const $left = $("<div/>")
                    .appendTo($info);

                const $name = $("<span/>")
                    .addClass("result__info-name")
                    .addClass("glyphicons glyphicons-flag")
                    .appendTo($left);

                const $right = $("<div/>")
                    .addClass("result__info-description")
                    .appendTo($info);

                const $descriptionMain = $("<span/>")
                    .addClass("result__info-description-main")
                    .html(stop.name)
                    .appendTo($right);

                const $newLine = $("<br/>")
                    .appendTo($right);

                const $descriptionSecondary = $("<span/>")
                    .addClass("result__info-description-secondary")
                    .text(stop.city)
                    .appendTo($right);
            }

            if (searchType === pis.SearchType.STOPS || searchType === pis.SearchType.CITY)
            {
                stopProcessor.fitStops(passedStops.map(stop => stop.id),
                {
                    maxZoom: minZoomStopPlatforms,
                    duration: fitDuration,
                    padding: getMapPadding()
                });
            }
        }

        //TODO pomenit classy
        $searchResultMain
            .find(".search-result__item")
            .last()
            .css("border-radius", "0px");

        $sidebar.removeClass("sidebar--empty");
    }

    function showSelectedLine(line, options)
    {
        window.simpleEvents.dispatchEvent(new Event('showLine'));
        
        view.set(view.State.LINE, line.id);

        const promiseRoutes = axGetAllLines(line.id);
        const promiseStops = axGetLineStops(line.id);
        const promiseDiagram = axGetLineStopList(line.id);

        let diagram;
        let diagramData;
        let routes = [];
        let direction = 1;

        $searchResultMain.hide();
        $searchResultDetail.empty();
        $searchResultDetail.show();

        const $resultHeader = $("<div/>")
            .addClass("result__item result__item--header")
            .appendTo($searchResultDetail);


        const $info = $("<div/>")
            .addClass("result__info")
            .appendTo($resultHeader);

        const $left = $("<div/>")
            .appendTo($info);

        const $label = createLineHeaderInfoLabel(line.lineNumberText) //Znacka
            .appendTo($left);

        const $right = $("<div/>")
            .addClass("result__info-description")
            .appendTo($info);

        const $descriptionMain = $("<span/>")
            .addClass("result__info-description-main")          
            .appendTo($right);

        setLineName(direction);        

        const $newLine = $("<br/>")
            .appendTo($right);

        const $descriptionSecondary = $("<span/>")
            .addClass("result__info-description-secondary")
            .text(line.name)
            .appendTo($right);

        const $control = $("<div/>")
            .addClass("result__control")
            .appendTo($resultHeader);

        const $close = $("<span/>")
            .addClass("result__close")
            .addClass("glyphicons glyphicons-remove")
            .click(() =>
            {
                $searchResultMain.show();
                $searchResultDetail.hide();
                resetView();

                //TODO systemovo, do f-cie, na stage.view
                //och 
                if ($searchResultMain.find("div").length)
                    $sidebar.removeClass("sidebar--empty");
            })
            .appendTo($control);

        const $listHeader = $("<div/>")
            .appendTo($searchResultDetail);

        const $listLabel = $("<h3/>")
            .addClass("search-result__label")
            .css("display", "inline-block")
            .text(local("sidebar.stops-on-line") /*+ " \"" + line.lineNumberText + "\""*/)
            .appendTo($listHeader);

        let setLineNameChangeDirection = null;

        const $changeDirection = $("<span/>")
            .addClass("search-result__control")
            .addClass("button")
            //.addClass("glyphicons glyphicons-resize-horizontal")
            .text(local("sidebar.change-direction"))
            .click(() =>
            {
                //TODO reset map premysliet
                resetView();

                direction = direction ? 0 : 1;
                // const lineDescription = direction ?
                //     line.startName + " - " + line.endName :
                //     line.endName + " - " + line.startName;

                // $descriptionMain.html(lineDescription);
                //setLineName(direction);
                setLineNameChangeDirection(direction);
                $stopsForward.toggle();
                $stopsBackward.toggle();
                //$content.scrollTop(0);

                let _routes = routes.filter(route => route.direction === direction);
                const _vehicles = prepareVehiclesForMap(_routes, pis.data.vehicles);

                showOnMap(_routes, _vehicles);
                setRefreshVehicles(_routes);

                _routes = _routes.filter(r => _vehicles.some(v => v.rn === r.name));
                const routesData = new Set(_routes.map(r => r.id));
                const vehiclesData = prepareVehiclesForDiagram(_routes, _vehicles);

                diagram.changeDirection(direction, routesData, true);
                diagram.setVehiclesData(vehiclesData);
                setRouteColorsOnMap();
                setMapClickHandlers();
            })
            .appendTo($listHeader);

        const $routeDiagram = $("<div/>")
            .attr("id", "route-diagram")
            .addClass("stops")
            //.css("display", "flex")          
            .appendTo($searchResultDetail);

        // const $routes = $("<div/>")
        //     .attr("id", "route-diagram")           
        //     .appendTo($routesAndStops);

        const $stops = $("<div/>")
            .css("flex", "1")               
            .appendTo($routeDiagram);

        const $stopsForward = $("<div/>")
            .addClass("stops stops--forward")
            .attr("data-direction", 1)
            .appendTo($stops);

        const $stopsBackward = $("<div/>")
            .addClass("stops stops--backward")
            .attr("data-direction", 0)
            .css("display", "none")
            .appendTo($stops);

        waitMe($content, "show");
        $sidebar.removeClass("sidebar--empty");

        //TODO urobi 5 glob 8lne fcie???

        function prepareVehiclesForMap(_routes, vehicles)
        {
            //TODO objekt vozidiel bud skratky z json alebo komplet nove atributy
            
            const _vehicles = vehicles
                .filter(vehicle => _routes.some(route => route.name === vehicle.rn))
                .map(vehicle => (
                {
                    vid: vehicle.vid,
                    o: vehicle.o,
                    tv: vehicle.tv,
                    la: vehicle.la,
                    lo: vehicle.lo,
                    az: vehicle.az,
                    rn: vehicle.rn,
                    spi: vehicle.spi,
                    pdf: vehicle.pdf,
                    nextStopName: local("no-data"),
                    timeToNextStopInSec: 0,
                    delay: (-1)*vehicle.d
                }));

            _vehicles.forEach(vehicle =>
            {    
                const route = _routes.find(r => r.name === vehicle.rn);
                const activeTripData = getActiveTripData(vehicle);        
                vehicle.routeAttributes = computeActiveTripAttributes(route.segments, activeTripData);              
            });

            return _vehicles;
        }

        function prepareVehiclesForDiagram(_routes, vehicles)
        {           
           const data = _routes.map(route => (
           {
                routeId: route.id,
                vehicles: vehicles.filter(vehicle => vehicle.rn === route.name)
                    .map(v => 
                    {
                        //todo nejako globalne zjednotit s computeVehicleRouteAttributes
                        const segment = pis.data.getRouteSegment(route, v.spi);

                        if (!segment)
                            return;

                        const segmentPoint = segment.points.find(p => p.segmentPointId === v.spi);
                        const segmentRatio = (segmentPoint.timeOnSegment / segment.segmentTime) || 0;   
                        const activeTripData = getActiveTripData(v);                        

                        const data = 
                        {
                            vehicleId: v.vid,
                            obuNumber: v.o,
                            vehicleType: v.tv,
                            segmentOrder: segment.segmentOrder,
                            segmentRatio: segmentRatio,
                            routeAttributes: computeActiveTripAttributes(route.segments, activeTripData)
                        };

                        return data;
                    })
                    .filter(data => data)
            }));

            return data;
        }

        function setRouteColorsOnMap() 
        {
            diagram.getRouteColors().forEach(routeColor => 
            {
                const routeFeature = routeProcessor.getRouteFeature(routeColor.routeId);

                if (!routeFeature)
                    return;

                routeFeature.set("highlightColor", routeColor.color);
            });
        }

        function setLineName(direction)
        {
            // const lineBone = direction 
            //     ? diagramData.structure.forward
            //     : diagramData.structure.backward;
            // const lineName = `${ lineBone[0].platformName } - ${ lineBone[lineBone.length - 1].platformName }`;            

            $descriptionMain.text(pis.data.getLineName(line, direction));
        }

        function showOnMap(routes, vehicles)
        {
            resetView();
            $sidebar.removeClass("sidebar--empty");
            stopProcessor.hide();
            vehicleProcessor.hide();
            routeProcessor.setRoutes(routes);
            routeProcessor.setVehicles(vehicles);

            if (!routes.length)
                return;            

            routeProcessor.fit(
            {
                padding: getMapPadding(),
                duration: fitDuration
            });

            let feature = routeProcessor.getFirstStop();
            stopPopupStart.setHeader(feature.get("name"));
            stopPopupStart.setContent();
            stopPopupStart.toggleClass("stop-popup--top-higher", true);
            //LACO & PATO 2020-11-03
            //stopPopupStart.setPosition(feature.getGeometry().getCoordinates());

            feature = routeProcessor.getLastStop();
            stopPopupEnd.setHeader(feature.get("name"));
            stopPopupEnd.setContent();
            stopPopupEnd.toggleClass("stop-popup--top-higher", true);
            //LACO & PATO 2020-11-03            
            //stopPopupEnd.setPosition(feature.getGeometry().getCoordinates());
        }

        function setRefreshVehicles(routes)
        {
            const updateCallback = axGetAllRtdVehicles_Loop.event.on("refresh", (vehicles) =>
            {
                if (!routeProcessor.isShown())
                {
                    axGetAllRtdVehicles_Loop.event.off("refresh", updateCallback);
                    return;
                }

                //console.log("updatujem");
                const _vehicles = prepareVehiclesForMap(routes, vehicles);
                const _routes = routes.filter(r => _vehicles.some(v => v.rn === r.name));
                routeProcessor.updateVehicles(_vehicles);
                //routeProcessor.setVehicles(_vehicles);

                const routesData = new Set(_routes.map(r => r.id));
                const vehiclesData = prepareVehiclesForDiagram(_routes, _vehicles);                

                diagram.updateVisibleData(routesData, vehiclesData);
            });
        }

        function setMapClickHandlers()
        {
            mapActionHandlers.on("vehicle.click", (vehicleFeature) => 
            {
                const vehicleId = vehicleFeature.get("id");
                const vehicle = diagram.getVehicleData(vehicleId);
                
                diagram.showVehicleTimes(vehicleId);                    
                //$("#route-diagram").scrollTop(vehicle.y);
                $("#route-diagram").animate(
                {
                    scrollTop: vehicle.y - 20
                }, 200, "swing");                    
            });
        }

        Promise.all([promiseRoutes, promiseStops, promiseDiagram])
            .then(resolve =>
            {
                routes = resolve[0].lines[0].routes;
                diagramData = resolve[2].data;
                
                const stopsForward = resolve[1].stops.forward;
                const stopsBackward = resolve[1].stops.backward;                
                let selectedStop;
                let selectedRoute;



                //console.log(routes);

                //If the stop is selected, decide the direction of line
                if (options && options.routeNumber)
                {
                    selectedRoute = routes.find(r => r.name === options.routeNumber);

                    if (selectedRoute)
                    {
                        direction = selectedRoute.direction;
                    }                    
                }

                if (options && options.stopId)
                {
                    if (direction === 1)
                    {
                        selectedStop = stopsForward.find(s => s.id === options.stopId);
                    }

                    if (!selectedStop)
                    {
                        selectedStop = stopsBackward.find(s => s.id === options.stopId);
                        if (selectedStop)
                        {
                            direction = 0;
                            $stopsForward.hide();
                            $stopsBackward.show();
                        }
                    }
                }

                if (direction === 1 && !stopsForward.length && stopsBackward.length)
                {
                    direction = 0;
                    $stopsForward.hide();
                    $stopsBackward.show();
                }

                //#region Stops -> sidebar

                setLineName(direction);

                $descriptionMain.text(pis.data.getLineName(resolve[0].lines[0], direction));

                setLineNameChangeDirection = function (direction) {
                    $descriptionMain.text(pis.data.getLineName(resolve[0].lines[0], direction));
                }
                // const $forwardList = createStopList$(stopsForward, line);
                // const $backwardList = createStopList$(stopsBackward, line);
                // $stopsForward.append($forwardList);
                // $stopsBackward.append($backwardList);               

                //#enderegion                

                //#region Routes -> map                           
               
                let _routes = routes.filter(route => route.direction === direction);
                const _vehicles = prepareVehiclesForMap(_routes, pis.data.vehicles);
                 showOnMap(_routes, _vehicles);
                _routes = routes.filter(r => _vehicles.some(v => v.rn === r.name));
                setRefreshVehicles(_routes);
                const routesData = new Set(_routes.map(r => r.id));
                const vehiclesData = prepareVehiclesForDiagram(_routes, _vehicles);
                //console.log(_routes, _vehicles);

                //#region Diagram

                //TODO vyrobit globalnu funkciu pre parovanie vehicle.rn === route.name

                diagram = new RouteDiagram(
                {
                    content: "#route-diagram",
                    data: diagramData,
                    direction: direction,
                    allowMaxWidthOfList: true,
                    showStopIcon: false,
                    //platformToSup: true,
                    vehicleIconScale: 0.0625,
                    visibleRoutes: routesData,
                    vehiclesData: vehiclesData,
                    vehicleIcons: 
                    {
                        bus: `${pis.settings.map.contentUrl}/${pis.map.style.getIconNameForVehicle(pis.TransportType.BUS)}.svg`,
                        tram: `${pis.settings.map.contentUrl}/${pis.map.style.getIconNameForVehicle(pis.TransportType.TRAM)}.svg`,
                        trolley: `${pis.settings.map.contentUrl}/${pis.map.style.getIconNameForVehicle(pis.TransportType.TROLLEY)}.svg`
                    },
                    svgDirection: "rtl",
                    highlightPlatform: options.platformId ? options.platformId : null
                });

                diagram.on("route.click", (routeData) => 
                {
                    const routeFeature = routeProcessor.getRouteFeature(routeData.routeId);

                    if (routeFeature.get("highlight"))
                    {
                        routeProcessor.clearRouteFeatureHighlight(routeData.routeId);
                        return;
                    }
                    
                    routeProcessor.highlightRouteFeature(routeData.routeId, 
                    {
                        color: routeData.color
                    });
                });

                diagram.on("vehicle.click", (vehicleData) => 
                {         
                    const vehicle = pis.data.getVehicleByObuNumber(vehicleData.obuNumber);
                    const routeFeature = routeProcessor.getRouteFeatureByRouteNumber(vehicle.rn);
                    const routeId = routeFeature.get("routeId");

                    showVehiclePopup(vehicle.vid,
                    {
                        isDisplayedOnRoute: true
                    });

                    //TODO event.once
                    const onHide = vehiclePopup.event.on("hide", () =>
                    {                        
                        routeProcessor.clearRouteFeatureHighlight(routeId);
                        vehiclePopup.event.off("hide", onHide);
                    });

                    //const vehicle = pis.data.getVehicle(vehicleData.vehicleId);                    
                    routeProcessor.highlightRouteFeature(routeId);                                 
                });                

                setRouteColorsOnMap();
                setMapClickHandlers();

                //diagram.setVehiclesData(prepareVehiclesForDiagram(_routes, _vehicles));

                //Az po nastaveni svgcka, aby mal spravnu vysku este bez skrolu
                //$routeDiagram .addClass("stops");           

                //#endregion

                //$content.scrollTop(0);

                
                // if (selectedStop)
                // {
                //     let $animate;
                //     if (direction === 1)
                //     {
                //         $stop = $stopsForward.find("div[data-id=" + selectedStop.id + "]");
                //         $animate = $stopsForward;
                //     }
                //     else
                //     {
                //         $stop = $stopsBackward.find("div[data-id=" + selectedStop.id + "]");
                //         $animate = $stopsBackward;
                //     }

                //     $stop.click();
                //     $animate.animate(
                //     {
                //         scrollTop: $stop.position().top + $animate.scrollTop()
                //     }, 200, "swing");
                // }

                //#enderegion
            })
            .catch((error1, error2) =>
            {
                console.log(error1, error2);
            })
            .finally(() =>
            {
                waitMe($content, "hide");
            });
    }
   
    async function showSelectedLineSchedules (line, platformId, options)
    {
        window.simpleEvents.dispatchEvent(new Event('showLine'));
        
        view.set(view.State.LINE_SCHEDULES, line.id);

        $searchResultMain.hide();
        $searchResultDetail.empty();
        $searchResultDetail.show();

        const $resultHeader = $("<div/>")
            .addClass("result__item result__item--header")
            .appendTo($searchResultDetail);


        const $info = $("<div/>")
            .addClass("result__info")
            .appendTo($resultHeader);

        const $left = $("<div/>")
            .appendTo($info);

        const $label = createLineHeaderInfoLabel(line.lineNumberText) //Znacka
            .appendTo($left);

        const $right = $("<div/>")
            .addClass("result__info-description")
            .appendTo($info);

            const $descriptionMain = $("<span/>")
            .addClass("result__info-description-main")
            //.html(line.startName + " &rarr; " + line.endName)
            .html('<span style="color: #0000003b; margin-right: 8px;">&#127985</span>' + line.routes[0].startName /*+ " - " + line.routes[0].endName*/)
            .appendTo($right);

        const $descriptionMain2 = $("<span/>")
            .addClass("result__info-description-main result__info-description-main--second")
            //.html(line.startName + " &rarr; " + line.endName)
            .html('<span style="color: #0000003b; margin-right: 8px;">&#127986</span>' + line.routes[0].endName)
            .appendTo($right);

        const $control = $("<div/>")
            .addClass("result__control")
            .appendTo($resultHeader);

        const $close = $("<span/>")
            .addClass("result__close")
            .addClass("glyphicons glyphicons-remove")
            .click(() =>
            {
                $searchResultMain.show();
                $searchResultDetail.hide();
                resetView();

                //TODO systemovo, do f-cie, na stage.view
                //och 
                if ($searchResultMain.find("div").length)
                    $sidebar.removeClass("sidebar--empty");
            })
            .appendTo($control);

        const $platformName = $('<div/>')
            .addClass("result__platform")
            .text(options.platformName ? options.platformName : '')
            .appendTo($searchResultDetail);

        axGetPlatformLineSchedule(platformId, line.id).then(data => {
            console.log(data);
            const $timescheduleWrap = $("<div/>")
                .addClass("timeschedule-wrap")
                .click(function(e)
                {
                    e.stopPropagation();
                })
                .appendTo($searchResultDetail);

            const $timescheduleFlex = $("<div/>")
                .addClass("timeschedule-flex")
                .appendTo($timescheduleWrap);

            const $timeschedule = createTimeSchedule$(data, true)
                .appendTo($timescheduleFlex);

            $timescheduleWrap.show();
        })
    }

    function showSelectedVehicle(vehicleId, axGetRoutePromise)
    {
        window.simpleEvents.dispatchEvent(new Event('showVehicle'));
        
        view.set(view.State.VEHICLE, vehicleId);

        const vehicle = pis.data.getVehicle(vehicleId);        
        const promiseStops = axGetPlatformsDataWithHistory(vehicle.ln, vehicle.tn, vehicle.rn, vehicle.o);

        $searchResultMain.hide();
        $searchResultDetail.empty();
        $searchResultDetail.show();

        const $listHeader = $("<div/>")
            .appendTo($searchResultDetail);

        const $listLabel = $("<h3/>")
            .addClass("search-result__label")
            .css("display", "inline-block")
            .text(`${local("sidebar.stops-on-line")} "${vehicle.ln}"`)
            .appendTo($listHeader);

        const $stops = $("<div/>")
            .addClass("stops stops--forward")
            .attr("data-direction", 1)
            .appendTo($searchResultDetail);

        waitMe($content, "show");
        $sidebar.removeClass("sidebar--empty");

        Promise.all([promiseStops, axGetRoutePromise])
            .then(resolve =>
            {
                const stops = resolve[0].platforms;
                const route = resolve[1].lines[0].routes[0];
                let $stopList;

                const isActiveAndValid = () => 
                {
                    const vehicle = pis.data.getVehicle(vehicleId);

                    return vehicle 
                        && view.getState() === view.State.VEHICLE 
                        && view.getReferenceValue() === vehicleId
                };

                const isTheSameRoute = () => 
                { 
                    const vehicle = pis.data.getVehicle(vehicleId);

                    return vehicle && vehicle.rn === route.name;
                };

                if (!isActiveAndValid())
                    return;               

                if (!isTheSameRoute())
                {       
                    const vehicle = pis.data.getVehicle(vehicleId);

                    if (!vehicle)
                        return;

                    const line = pis.data.getLineByLineNumberText(vehicle.ln);
                    const lineRoute = line.routes.find(route => route.name === vehicle.rn);

                    showSelectedVehicle(vehicleId, axGetRoute(line.id, lineRoute.id));

                    return;
                }

                const update = (vehicle) => 
                {
                    $stopList = createVehicleStopList$(vehicle, stops, route);
                    $stops.empty();
                    $stops.append($stopList);
                };                         
               
                const updateCallback = axGetAllRtdVehicles_Loop.event.on("refresh", (vehicles) =>
                {
                    const vehicle = vehicles.find(v => v.vid === vehicleId);

                    if (!isActiveAndValid() || !isTheSameRoute())
                    {
                        //console.log("cotrol", isActiveAndValid(), isTheSameRoute());
                        axGetAllRtdVehicles_Loop.event.off("refresh", updateCallback);                      

                        if (!isActiveAndValid())
                            return;   

                        if (!isTheSameRoute())
                        {
                            const line = pis.data.getLineByLineNumberText(vehicle.ln);
                            const lineRoute = line.routes.find(route => route.name === vehicle.rn);
                                                     
                            showSelectedVehicle(vehicleId, axGetRoute(line.id, lineRoute.id));                         
                        }

                        return;
                    }
                    
                    //console.log("update");
                    update(vehicle);
                });

                update(vehicle);

                const $activeStop = $stopList.find($div => $div.hasClass("stop--active"));
                $stops.animate(
                {
                    scrollTop: $activeStop.position().top + $stops.scrollTop()
                }, 200, "swing");
            })
            .catch((error1, error2) =>
            {
                console.log(error1, error2);
            })
            .finally(() =>
            {
                waitMe($content, "hide");
            });
    }

    function showSelectedStop(stopName, optShowDepartures)
    {
        waitMe($content, "show");
        $sidebar.removeClass("sidebar--empty");
        
        window.simpleEvents.dispatchEvent(new Event('showStop'));
        //TODO pouzit grupu Map
        let stops = pis.data.stops.filter(stop => stop.name === stopName);

        if(!stops.length) {
            stops = pis.data.stopsGroupedByName.has(stopName) ? pis.data.stopsGroupedByName.get(stopName) : [];
        }

        const stopIds = stops.map(stop => stop.id);
        const promises = [];
        const promise1 = axGetTripsOnPlatforms(...stopIds);

        promises.push(promise1);

        if (optShowDepartures)
        {
            const promise2 = axGetDeparturesOnPlatformWeb(...stopIds);
            //const promise3 = axGetAnnouncementsRepeat(...stopIds);

            promises.push(promise2);
            //promises.push(promise3);
        }

        Promise.all(promises)
            .then(resolve =>
            {
                let lines = resolve[0].lines;
                lines = wh.distinctBy(lines, "id");
                //lines.sort(wh.comparable("number"));
                lines = sortLinesZTM(lines.map(line => 
                ({
                    id: line.id,
                    name: line.name,
                    number: line.number,
                    routes: line.routes,

                    //lineNumberText: line.name //kvoli tomuto //comment Michal Trnka 12.10.2023
                    lineNumberText: line.numberText //pridal Michal Trnka 12.10.2023
                })));
                lines.forEach((line) =>
                {
                    //hack
                    line.routes.forEach((route) =>
                    {
                        route.name = route.routeNumber;
                    });


                    const $resultHeader = $("<div/>")
                        .addClass("result__item")
                        .click(function()
                        {
                            const stopIndex = resolve.findIndex(data =>
                            {
                                //TODO Hack zase, treba smer alebo co
                                return lines.some(l => l === line);
                            });

                            showSelectedLine(
                            { //hack
                                id: line.id,
                                lineName: line.name,
                                //lineNumberText: line.name, //comment Michal Trnka 12.10.2023
                                lineNumberText: line.lineNumberText, //pridal Michal Trnka 12.10.2023
                                lineKind: line.lineKind,
                                startName: line.routes[0].startName,
                                endName: line.routes[0].endName,
                                routes: line.routes
                            }, { stopId: stops[stopIndex].id });
                        })
                        .appendTo($searchResultMain);

                    const $info = $("<div/>")
                        .addClass("result__info")
                        .appendTo($resultHeader);

                    const $left = $("<div/>")
                        .appendTo($info);
                       
                    const $label = createLineHeaderInfoLabel(line.number) //lineNumberText
                        .appendTo($left);

                    const $right = $("<div/>")
                        .addClass("result__info-description")
                        .appendTo($info);

                    if (!line.routes.length)
                        return;

                    const $descriptionMain = $("<span/>")
                        .addClass("result__info-description-main")
                        //.html(line.startName + " &rarr; " + line.endName)
                        //TODO linka ma mat startName, endName
                        .html(line.routes[0].startName + " - " + line.routes[0].endName)
                        .appendTo($right);
                });

                if (optShowDepartures)
                {
                    departures = resolve[1] && resolve[1].departures
                        ? resolve[1].departures
                        : {};
                    //const departures = processMultipleStopDepartures(departuresData);
                    const feature = stopProcessor.getStopFeature(stopName);

                    showStopPopupDepartures(stops, feature, departures/*, announcements*/);
                }
            })
            .catch((error) =>
            {
                console.log(error);
            })
            .finally(() =>
            {
                waitMe($content, "hide");
            });

        $searchResultMain.empty();
        $searchResultDetail.hide();

        const $resultHeader = $("<div/>")
            .addClass("result__item result__item--header")
            .appendTo($searchResultMain);

        const $info = $("<div/>")
            .addClass("result__info")
            .appendTo($resultHeader);

        const $left = $("<div/>")
            .appendTo($info);

        const $name = $("<span/>")
            .addClass("result__info-name")
            .addClass("glyphicons glyphicons-flag")
            .appendTo($left);

        const $right = $("<div/>")
            .addClass("result__info-description")
            .appendTo($info);

        const $descriptionMain = $("<span/>")
            .addClass("result__info-description-main")
            .html(stopName)
            .appendTo($right);

        let $newLine = $("<br/>")
            .appendTo($right);

        const $descriptionSecondary = $("<span/>")
            .addClass("result__info-description-secondary")
            .text(pis.data.stopsGroupedByName.get(stopName)[0].city) //TODO ja uz neviem
            .appendTo($right);

        const $control = $("<div/>")
            .addClass("result__control")
            .appendTo($resultHeader);

        const $close = $("<span/>")
            .addClass("result__close")
            .addClass("glyphicons glyphicons-remove")
            .click(() =>
            {
                //TODO back to stop-name map view
                $searchResultMain.empty();
                resetView();
            })
            .appendTo($control);


        const $platforms = createStopPlatformsBar$(stopName,
            {
                platformClickCalback: (stopPlatf) => 
                {
                    if (stopPlatf.platf === "*")
                    {
                        showSelectedStop(stopName, true);
                    }
                    else
                    {
                        showSelectedStopPlatform(stopPlatf);
                    }
                    
                }
            })
            .appendTo($searchResultMain);

        const $labelLines = $("<h3/>")
            .addClass("search-result__label")
            .text(local("sidebar.lines-crossing-bus-stop"))
            .appendTo($searchResultMain);

        stopProcessor.fitStops(stops.map(stop => stop.id),
        {
            maxZoom: optShowDepartures 
                ? minZoomStopPlatforms - 1 
                : minZoomStopPlatforms,
            duration: fitDuration,
            padding: getMapPadding()
        });

        $searchResultMain.show();
    }

    function showSelectedStopPlatform(stop)
    {
        waitMe($content, "show");
        $sidebar.removeClass("sidebar--empty");
        
        window.simpleEvents.dispatchEvent(new Event('showStopPlatform'));
        
        const promise1 = axGetTripsOnPlatforms(stop.id);
        const promise2 = axGetDeparturesOnPlatformWeb(stop.id);
        const promise3 = axGetAnnouncementsRepeat(stop.id);

        let $schedulesResult = null;

        const promise = Promise.all([promise1, promise2, promise3])
            .then(resolve =>
            {
                //TODO osetri multiclick ak este prebieha ajax
                //TODO samozrejme hruza
                $searchResultMain.find(".result__item").not(".result__item--header").remove();

                $schedulesResult = $('<div/>')
                    .addClass('result__schedules')
                    .appendTo($searchResultMain);

                $schedulesResult.hide();

                let lines = (resolve[0] && resolve[0].lines ?
                    resolve[0].lines : []);
                const departures = (resolve[1] && resolve[1].departures
                        ? resolve[1].departures 
                        : []);
                const announcements = (resolve[2] && resolve[2].announcements ?
                    resolve[2].announcements : []);

                //TODO zjednotit s rovnakym kodom v showSelectedStop
                lines = wh.distinctBy(lines, "id");
                //lines.sort(wh.comparable("number"));
                lines = sortLinesZTM(lines.map(line => 
                ({
                    id: line.id,
                    name: line.name,
                    number: line.number,
                    routes: line.routes,
                    lineNumberText: line.numberText //kvoli tomuto
                })));
                lines.forEach((line) =>
                {
                    //hack
                    line.routes.forEach((route) =>
                    {
                        route.name = route.routeNumber;
                    });

                    const $resultHeader = $("<div/>")
                        .addClass("result__item")
                        .click(function()
                        {
                            showSelectedLineSchedules(line, stop.id, {platformName: `[${stop.platf}] ${stop.name}`});
                        })
                        .appendTo($schedulesResult);

                    const $info = $("<div/>")
                        .addClass("result__info")
                        .appendTo($resultHeader);


                    const $left = $("<div/>")
                        .appendTo($info);

                    const $label = createLineHeaderInfoLabel(line.number) //lineNumberText
                        .appendTo($left);


                    const $right = $("<div/>")
                        .addClass("result__info-description")
                        .appendTo($info);

                    if (!line.routes.length)
                        return;

                    const $descriptionMain = $("<span/>")
                        .addClass("result__info-description-main")
                        //.html(line.startName + " &rarr; " + line.endName)
                        .html('<span style="color: #0000003b; margin-right: 8px;">&#127985</span>' + line.routes[0].startName /*+ " - " + line.routes[0].endName*/)
                        .appendTo($right);

                    const $descriptionMain2 = $("<span/>")
                        .addClass("result__info-description-main result__info-description-main--second")
                        //.html(line.startName + " &rarr; " + line.endName)
                        .html('<span style="color: #0000003b; margin-right: 8px;">&#127986</span>' + line.routes[0].endName)
                        .appendTo($right);
                });

                const feature = stopProcessor.getStopPlatformFeature(stop.id);
                showStopPopupDepartures([stop], feature, departures, announcements);
                showStopDepartures(departures);

            })
            .catch((error1, error2) =>
            {
                console.log(error1, error2);
            })
            .finally(() =>
            {
                waitMe($content, "hide");
            });

        $searchResultMain.empty();
        $searchResultDetail.hide();

        const $resultHeader = $("<div/>")
            .addClass("result__item result__item--header")
            .appendTo($searchResultMain);

        /* Menu */
        const $menu = $('<ul/>')
        .addClass('nav nav-tabs')
        .appendTo($searchResultMain);

        const $menuDeparturesLi = $('<li/>')
            .addClass('active')
            .click(function (event){
                $menuSchedulesLi.removeClass('active');
                $menuDeparturesLi.addClass('active');
                $('.search-result--main .result__departures').show();
                $schedulesResult.hide();
            })
            .appendTo($menu);

        const $menuDeparturesA = $('<a/>')
            .text(local('sidebar.Departures'))
            .appendTo($menuDeparturesLi);

        const $menuSchedulesLi = $('<li/>')
            .click(function(event) {
                $menuDeparturesLi.removeClass('active');
                $menuSchedulesLi.addClass('active');
                $('.search-result--main .result__departures').hide();
                $schedulesResult.show();
            })
            .appendTo($menu);

        const $menuSchedulesA = $('<a/>')
            .text(local('sidebar.Schedules'))
            .appendTo($menuSchedulesLi);

        /**************** */

        const $info = $("<div/>")
            .addClass("result__info")
            .appendTo($resultHeader);

        const $left = $("<div/>")
            .appendTo($info);

        const $name = $("<span/>")
            .addClass("result__info-name")
            .addClass("glyphicons glyphicons-flag")
            .appendTo($left);

        const $right = $("<div/>")
            .addClass("result__info-description")
            .appendTo($info);

        const $descriptionMain = $("<span/>")
            .addClass("result__info-description-main")
            .html(stop.name)
            .appendTo($right);

        //TODO css classy
        const $descriptionMainPlatf = $("<span/>")
            .addClass("result__info-description-main")
            .css("color", "#979797")
            //.css("text-decoration", "underline")
            .html(`[ ${stop.platf} ]`)
            .appendTo($right);

        const $newLine = $("<br/>")
            .appendTo($right);

        const $descriptionSecondary = $("<span/>")
            .addClass("result__info-description-secondary")
            .text(stop.city)
            .appendTo($right);

        const $control = $("<div/>")
            .addClass("result__control")
            .appendTo($resultHeader);

        const $close = $("<span/>")
            .addClass("result__close")
            .addClass("glyphicons glyphicons-remove")
            .click(() =>
            {
                //TODO back to sinlge stop-platform map view\
                $searchResultMain.empty();
                resetView();
            })
            .appendTo($control);

        const $platforms = createStopPlatformsBar$(stop.name,
            {
                platformClickCalback: (stopPlatf) => 
                {
                    if (stopPlatf.platf === "*")
                    {
                        showSelectedStop(stop.name, true);
                    }
                    else
                    {
                        showSelectedStopPlatform(stopPlatf);
                    }
                    
                }
            })
            .appendTo($searchResultMain);

        const $labelLines = $("<h3/>")
            .addClass("search-result__label")
            .text(local("sidebar.lines-crossing-bus-stop"))
            .appendTo($searchResultMain);

        stopProcessor.fitStops([stop.id],
        {
            maxZoom: Math.max(minZoomStopPlatforms, mapExtender.getZoom()),
            duration: fitDuration,
            padding: getMapPadding()
        });

        $searchResultMain.show();
    }

    function processMultipleStopDepartures(data)
    {
        data.departures.forEach(departure => 
        {         
            const stop = data.platforms.find(platform => platform.id === departure.platformId);
            departure.platform = stop.platformNumber;
        });       

        return data.departures;
    }     

    function filterLines(searchText, optTransportType)
    {
        let passedLines = [];
        const filteredByIndexWeight = wh.filterArrayByIndexWeight(pis.data.lines, searchText, ["lineNumberText", "startName", "endName"]);
        //const filteredByIndexWeight = wh.filterArrayByIndexWeight(pis.data.lines, searchText, ["lineNumberText"]);

        if (!filteredByIndexWeight)
            return passedLines;

        const keys = Object.keys(filteredByIndexWeight);

        //console.log(filteredByIndexWeight, keys);
        //console.log((new Date().getTime()));
        for (let i = 0; i < keys.length; i++)
        {
            const key = keys[i];
            const keyValues = filteredByIndexWeight[key]
                .sort(wh.comparable("lineNumberText.length"));
            //.sort((l1, l2) => l1.lineNumberText.length < l2.lineNumberText.length ? -1 : 1);           
            //console.log(keyValues);

            for (let j = 0; j < keyValues.length; j++)
            {
                //console.log(keyValues[j]);
                passedLines.push(keyValues[j]);
            }
        }
        //console.log((new Date().getTime()));
        //console.log(passedLines);
        if (optTransportType)
        {
            //console.log("hej do pice");            
            passedLines = passedLines.filter(line => optTransportType & pis.transportType.getForLine(line.lineKind));
        }

        //console.log(passedLines);
        return passedLines;
    }

    function filterLinesZTM(searchText, optTransportType)
    {
        let passedLines = [];
        let filtered = wh.filterArray(pis.data.lines, searchText, ["lineNumberText", "startName", "endName"]);       

        if (optTransportType)
        {              
            filtered = filtered.filter(line => optTransportType & pis.transportType.getForLine(line.lineKind));
        }

        if (!filtered)
        {
            return passedLines;
        }

        sortLinesZTM(filtered);

        return filtered;
    }

    function sortLinesZTM(lines)
    {           
        // const stripLineNumberText = (lineNumberText) => 
        // {            
        //     const firstChar = lineNumberText[0];
        //     const lastChar = lineNumberText[lineNumberText.length - 1];
        //     let strippedLineNumberText = lineNumberText;        
        //     let priorityIndex = sortPriority.indexOf(firstChar); 
            
        //     if (priorityIndex === -1)
        //     {
        //         priorityIndex = sortPriority.indexOf(lastChar);
        //     }

        //     if (priorityIndex > -1)
        //     {
        //         strippedLineNumberText = lineNumberText.replace(sortPriority[priorityIndex], "");                
        //     }            

        //     return strippedLineNumberText;
        // };
        
        const firstCharPriority = { "M": 1, "T": 2, "T-": 3, "B": 4, "A": 5, /*numeric: 6*/ "Sz": 7, "AP": 8 };
        const lastCharPriority = { "A": 9, "N": 10 };
        
        const stripLineNumberText = (lineNumberText) => 
        {
            return lineNumberText.replace(/\D/g, "");
        };

        //Elegant one-step sorting

        // const setPriority = (lineNumberText) => 
        // {
        //     const firstChar = lineNumberText[0];
        //     const lastChar = lineNumberText[lineNumberText.length - 1];
        //     const intFirstChar = parseInt(firstChar);
        //     const intLastChar = parseInt(lastChar);
        //     const strippedValue = stripLineNumberText(lineNumberText);
        //     let numericPriority = parseInt(strippedValue);
        //     let letterPriority;

        //     if (intFirstChar)
        //     {
        //         if (intLastChar)
        //         {                    
        //             letterPriority = 6;                    
        //         }
        //         else
        //         {
        //             letterPriority = lastCharPriority[lastChar];
        //         }
        //     }
        //     else
        //     {               
        //         if (lineNumberText.length === 1 || parseInt(lineNumberText[1]))
        //         {
        //             letterPriority = firstCharPriority[firstChar];                    
        //         }
        //         else
        //         {
        //             letterPriority = firstCharPriority[lineNumberText.substring(0, 1)];
        //         }
        //     }

        //     //10 letter priorities
        //     return numericPriority * 10 + letterPriority;
        // };

        // const comaparableLetter = wh.comparable("lineNumberText", { valueFunction: (lineNumberText) => 
        // {
        //     const sortPriority = setPriority(lineNumberText);

        //     return sortPriority;
        // }});

        //lines.sort(comaparableLetter);

        const setPriority = (lineNumberText) => 
        {
            const firstChar = lineNumberText[0];
            const lastChar = lineNumberText[lineNumberText.length - 1];
            const intFirstChar = parseInt(firstChar);
            const intLastChar = parseInt(lastChar);                 

            if (intFirstChar)
            {
                if (intLastChar)
                {
                    return 6;
                }

                return lastCharPriority[lastChar];
            }
            else
            {               
                if (lineNumberText.length === 1 || parseInt(lineNumberText[1]))
                {
                    return firstCharPriority[firstChar];
                }
                
                return firstCharPriority[lineNumberText.substring(0, 1)];                
            }          
        };

        const comparableNumeric = wh.comparable("lineNumberText", { valueFunction: (lineNumberText) => 
        {
            const strippedValue = stripLineNumberText(lineNumberText);

            return parseInt(strippedValue);
        }});

        //sort by stripped numeric lineNumberText
        lines.sort(comparableNumeric);

        //console.log(lines.map(l => l.lineNumberText));        

        //sort again by priority, but only the subparts with the same numeric value
        lines.sort((line1, line2) => 
        {
            const strippedLineNumberText1 = stripLineNumberText(line1.lineNumberText);
            const strippedLineNumberText2 = stripLineNumberText(line2.lineNumberText);

            //Skip already sorted by numeric value
            if (strippedLineNumberText1 !== strippedLineNumberText2)
            {
                return 0;
            }

            //If the numeric value is the same, then apply sort priority
            const sortPriority1 = setPriority(line1.lineNumberText);
            const sortPriority2 = setPriority(line2.lineNumberText);

            return sortPriority1 - sortPriority2;
         });       
       
        return lines;
    }

    function sortLinesZTMOld(lines)
    {
        const sorted = [];
        const comparable = wh.comparable("lineNumberText");
        const linesGroupedByType = { M: [], T: [], B: [], A: [], numeric: [], N: [] };        
     
        lines.forEach(l => 
        {
            const firstChar = l.lineNumberText[0];
            const lastChar = l.lineNumberText[l.lineNumberText.length - 1];
            const key = firstChar in linesGroupedByType
                ? firstChar 
                : lastChar in linesGroupedByType 
                    ? lastChar 
                    : "numeric";

            linesGroupedByType[key].push(l);
        });

        Object.values(linesGroupedByType).forEach(linesOfSpecificType => 
        {
            linesOfSpecificType.sort(comparable);
            sorted.push(...linesOfSpecificType);
        });

        return sorted;
    }

    function filterStops(searchText, optTransportType)
    {
        let passedStops = [];
        const filteredByIndexWeight = wh.filterArrayByIndexWeight(pis.data.distinctStops, searchText, ["name"]);

        if (!filteredByIndexWeight)
            return passedStops;

        const keys = Object.keys(filteredByIndexWeight);

        //console.log(filteredByIndexWeight, keys);
        for (let i = 0; i < keys.length; i++)
        {
            const key = keys[i];
            const keyValues = filteredByIndexWeight[key]
                //.sort((l1, l2) => l1.name.length < l2.name.length ? -1 : 1);
                .sort(wh.comparable("name.length"));

            for (let j = 0; j < keyValues.length; j++)
            {
                passedStops.push(keyValues[j]);
            }
        }

        if (optTransportType)
        {
            passedStops = passedStops.filter(stop => optTransportType & pis.transportType.getAllForStop(stop.platformKind));
        }

        return passedStops;
    }

    function filterCities(searchText)
    {
        const passedCities = [];
        const hackedArr = pis.data.distinctStopCities.map(city => (
        {
            name: city
        }));
        const filteredByIndexWeight = wh.filterArrayByIndexWeight(hackedArr, searchText, ["name"]);

        if (!filteredByIndexWeight)
            return passedCities;

        const keys = Object.keys(filteredByIndexWeight);

        //console.log(filteredByIndexWeight, keys);
        for (let i = 0; i < keys.length; i++)
        {
            const key = keys[i];
            const keyValues = filteredByIndexWeight[key]

            for (let j = 0; j < keyValues.length; j++)
            {
                passedCities.push(keyValues[j]);
            }
        }

        return passedCities;
    }

    function createLineHeaderInfoLabel(lineNumberText)
    {
        const $label = $("<div/>")
            .addClass("result__info-name");

        const $icon1 = $("<span/>")
            .addClass("glyphicons glyphicons-vector-path-line")
            .css("transform", "rotate(-45deg)")
            .appendTo($label);

        const $icon2 = $("<span/>")
            .text("L")
            .css("position", "relative")
            .css("left", "-6px")
            .css("margin-left", "0px")
            .appendTo($label);

        const $name = $("<span/>")
            .css("position", "relative")
            .css("margin-left", "2px") /*8 - 6*/
            .text(lineNumberText)
            .appendTo($label);

        return $label;
    }    

    function createMapListeners()
    {
        map.on("click", function(event)
        {            
            let minPixelDistance;
            let feature;
            let layer;

            //In case of multiple clicked features, select the closest one to the clicked pixel coordinates
            map.forEachFeatureAtPixel(event.pixel, (clickedFeature, clickedLayer) =>
            {   
                const coordinates = clickedFeature.getGeometry().getCoordinates(); 
                const pixel = map.getPixelFromCoordinate(coordinates);
                const pixelDistance = Math.sqrt(
                    Math.pow(event.pixel[0] - pixel[0], 2) + 
                    Math.pow(event.pixel[1] - pixel[1], 2));
                
                if (!minPixelDistance || pixelDistance < minPixelDistance)
                {
                    minPixelDistance = pixelDistance;
                    feature = clickedFeature;
                    layer = clickedLayer;
                }
            },
            {
                hitTolerance: 4
            });

            if (!feature)
                return;            

            const isVehicleLayer = layer.get("name") === "Vehicles";
            const isStopPlatformLayer = layer.get("name") === "StopPlatforms";
            const isStopLayer = layer.get("name") === "Stops";

            if (isVehicleLayer)
            {
                const features = feature.get("features");

                if (features && features.length > 1)
                    return;

                if (features)
                {
                    feature = features[0];
                }

                const vehicleId = feature.get("id");

                if (vehiclePopup.getPosition() && vehiclePopup.getReferenceId() === vehicleId)
                {
                    vehiclePopup.hide();
                    return;
                }

                const isDisplayedOnRoute = routeProcessor.isShown() && routeProcessor.getVehicleFeature(vehicleId);

                if (isDisplayedOnRoute)
                {
                    const routeNumber = feature.get("routeNumber");
                    const routeFeature = routeProcessor.getRouteFeatureByRouteNumber(routeNumber);
                    const routeId = routeFeature.get("routeId");
                    routeProcessor.highlightRouteFeature(routeId);

                    //TODO event.once
                    const onHide = vehiclePopup.event.on("hide", () =>
                    {                        
                        routeProcessor.clearRouteFeatureHighlight(routeId);
                        vehiclePopup.event.off("hide", onHide);
                    }); 

                    mapActionHandlers.call("vehicle.click", feature);
                }

                const axGetRoutePromise = showVehiclePopup(vehicleId,
                {
                    isDisplayedOnRoute: isDisplayedOnRoute
                });

                if (!isDisplayedOnRoute)
                {                    
                    showSelectedVehicle(vehicleId, axGetRoutePromise);          
                }                

                return;
            }

            if (isStopPlatformLayer)
            {
                const features = feature.get("features");

                //TODO podla options stopprocessora
                if (features && features.length > 1)
                {
                    const extent = wertyz.map.helper.getExtent(features);
                    mapExtender.fit(extent,
                    {
                        //maxZoom: minZoomStopPlatforms,
                        duration: fitDuration,
                        padding: getMapPadding()
                    });

                    return;
                }

                if (features)
                    feature = features[0];

                if (stopProcessor.hasStopFeature(feature))
                {
                    const stopId = feature.get("id");
                    const stop = pis.data.getStop(stopId);

                    view.set(view.State.STOP, stop.id);
                    showSelectedStopPlatform(stop);

                    return;
                }
            }

            if (isStopLayer)
            {
                const name = feature.get("name");
                const stops = pis.data.stopsGroupedByName.get(name);

                view.set(view.State.STOP, name);
                showSelectedStop(name);

                stopProcessor.fitStops(stops.map(stop => stop.id),
                {
                    maxZoom: minZoomStopPlatforms,
                    duration: fitDuration,
                    padding: getMapPadding()
                });

                return;
            }

            if (routeProcessor.hasStopFeature(feature))
            {
                const stopId = feature.get("id");
                const routeId = feature.get("routeId");
                const stop = pis.data.getStop(stopId);
                const line = pis.data.lines.find(line => line.routes.some(route => route.id === routeId));
                toggleTimeschedule(stop, line);

                return;
            }
        });

        map.on('moveend', function(event)
        {           
            const zoom = map.getView().getZoom();

            if (zoom >= 17 && vehicleProcessor._vehicleSource.getDistance() !== 0)
            {
                //TODO pridat metodu setDistance na processor
                vehicleProcessor._vehicleSource.setDistance(0);
            }
            else if (zoom < 17 && vehicleProcessor._vehicleSource.getDistance() === 0)
            {   
                //TODO pridat metodu setDistance na processor
                 vehicleProcessor._vehicleSource.setDistance(20);
            }

            if(zoom >= 10)
            {
                placeProcessor.show();
            }
            else 
            {
                placeProcessor.hide();
            }
        });
    }

    function addZtmAttributionOverlay()
    {
        const $div = $("<div>")
            .appendTo($("body"));
        const $a = $("<a>")
            .attr("href", "https://bip.metropoliagzm.pl/attachments/download/191348")
            .attr("target", "_blank")
            //.css("color", "black")
            .appendTo($div);
        const $span = $("<span>")
            .css("margin-right", "1rem")
            .css("font-weight", "bold")
            .text("deklaracja dostępności")
            .appendTo($a);
        const $image = $("<img>")
            .attr("src", pis.settings.map.contentUrl + "/mztm/eu.png")
            .appendTo($div);     
        const overlay = new ol.Overlay(
        {
            element: $div.get(0),
            className: "ol-ztm-attribution",
            //positioning: "bottom-center"
        });       

        map.addOverlay(overlay);
        $(".ol-ztm-attribution").show();        
    }

    function createStopPopup(map)
    {
        const $popup = $("<div>")
            .addClass("stop-popup")
            .appendTo($("body"));

        const $content = $("<div>")
            .addClass("stop-popup__content")
            .appendTo($popup);

        const $header = $("<div>")
            .addClass("stop-popup__header")
            .appendTo($popup);

        //TODO ten typ nieee
        const popup = new pis.map.Popup($popup.get(0), map, "stop");

        return popup;
    }

    function createVehiclePopup(map)
    {
        const $popup = $("<div>")
            .addClass("vehicle-popup")
            .appendTo($("body"));

        const $content = $("<div>")
            .addClass("vehicle-popup__content")
            .appendTo($popup);        

        // const $header = $("<div>")
        //     .addClass("vehicle-popup__header")
        //     .appendTo($popup);

        const popup = new pis.map.Popup($popup.get(0), map, "vehicle"); //TODO toto inak urobit

        const $close = $("<span>")
            .addClass("vehicle-popup__close")
            .addClass("glyphicons glyphicons-remove")           
            .click(() => 
            {
                popup.hide();
            })
            .appendTo($popup);

        return popup;
    }

    function createVehiclePopupContent(vehicle, line, optRouteSegments)
    {
        const content = {};

        const $flexWrap = $("<div/>")
            .addClass("vehicle-popup__content-flex")

        const $left = $("<div/>")
            .addClass("vehicle-popup__content-left")
            .appendTo($flexWrap);

        const $line = $("<p/>")
            .addClass("vehicle-popup__content-item")
            .text(line.lineNumberText)
            .appendTo($left);

        const $right = $("<div/>")
            .addClass("vehicle-popup__content-right")
            .appendTo($flexWrap);

        let lineName;
        if (vehicle.rn)
        {
            const route = line.routes.find(route => route.name === vehicle.rn);
            lineName = `${route.startName} - ${route.endName}`;
        }
        else
        {
            lineName = pis.data.getLineName(line);
        }        

        const $lineName = $("<p/>")
            .addClass("vehicle-popup__content-item")
            .text(lineName)
            .appendTo($right);

        const $stop = $("<p/>")
            .addClass("vehicle-popup__content-item vehicle-popup__content-item--small")
            .appendTo($right);

        if (optRouteSegments)
        {
            const activeTripData = getActiveTripData(vehicle);                
            const computed = computeActiveTripAttributes(optRouteSegments, activeTripData);

            const $part1 = $("<span/>")
                .text(local("map.arrival-at") + " ")
                .appendTo($stop);

            const $part2 = $("<span/>")
                .addClass("vehicle-popup__content-item--black")
                .text(`${computed.nextStopName}`)
                .appendTo($stop);

            const $part3 = $("<span/>")
                .text(" " + local("map.in").toLowerCase() + " ")
                .appendTo($stop);

            const $part4 = $("<span/>")
                //.addClass("vehicle-popup__content-item--red")
                .addClass("vehicle-popup__content-item--black")
                .text(`${parseInt(computed.timeToNextStopInSec / 60)}`)
                .appendTo($stop);

            const $part5 = $("<span/>")
                .addClass("vehicle-popup__content-item--black")
                .text(" " + local("map.minutes"))
                .appendTo($stop);
        }
        else
        {
            $stop.html("&nbsp;");
        }

        const $hr = $("<hr/>")
            .css("margin-top", "inherit")
            .css("margin-bottom", "inherit")
            .appendTo($right);

        const $wrp = $("<div/>")
            .css("display", "flex")
            .appendTo($right);

        const $wrp1 = $("<div/>")
            .attr("style", "white-space: nowrap;")
            .appendTo($wrp);

        const $iconVehicle = $("<span/>")
            .addClass("glyphicons glyphicons-bus")
            .attr("style", "font-size: 14px; vertical-align: text-bottom; line-height: 1.42857143;")
            .appendTo($wrp1);
        
        const $iconLock = $("<span/>")
            .addClass("glyphicons glyphicons-unlock")
            .attr("style", "font-size: 14px; vertical-align: text-bottom; line-height: 1.42857143; margin-left: 10px; cursor: pointer;")          
            .appendTo($wrp1);

        const $vehicle = $("<span/>")
            .attr("title", local("map.follow-vehicle"))
            .attr("style", "font-size: 14px; margin-left: 10px; font-weight: normal; color: #333;")
            .text(`${vehicle.pro ? vehicle.pro + ' / ' : '' } ${vehicle.b}`)          
            .appendTo($wrp1);

        const $wrp2 = $("<div/>")
            .attr("style", "flex: 1; margin-left: 20px; text-align: right; white-space: nowrap;")
            .appendTo($wrp);

        const $iconDelay = $("<span/>")
            .addClass("glyphicons glyphicons-clock")
            .attr("style", "font-size: 14px; vertical-align: text-bottom; line-height: 1.42857143;")
            .appendTo($wrp2);

        const $part1x = $("<span/>")
            .attr("style", "font-size: 14px; margin-left: 10px; font-weight: normal; color: #333;")
            .appendTo($wrp2);

        if (!vehicle.d || (vehicle.d > -60 && vehicle.d < 180))
        { //delay between -1min and 3min
            $part1x.text(local("map.no-delay"));
        }
        else if (vehicle.d)
        {
            const $part2x = $("<span/>")
                .attr("style", "font-size: 14px; font-weight: normal; border-radius: 4px; background-color: white; padding: 2px 4px; font-weight: 600;")
                .text(` ${parseInt(vehicle.d / 60)} ${local("map.minutes")}`)
                .appendTo($wrp2);

            if (vehicle.d <= -60)
            { //delay less than -1min
                $part1x.text(local("map.in-advance"));
                $part2x.css("color", "red");
            }
            else
            {
                $part1x.text(local("map.delay"));

                if (vehicle.d >= 180 && vehicle.d < 300)
                { //delay more than 3min                    
                    $part2x.css("color", "olive");
                }
                else
                { //delay more than 5min                   
                    $part2x.css("color", "blue");
                }
            }
        }

        /*
        const $part3x = $("<span/>")
            .attr("style", "font-size: 14px; font-weight: normal; color: #333;")
            .text(` ${local("map.on-course").toLowerCase()} ${vehicle.tn}`)
            .appendTo($wrp2);
            */

        content.$element = $flexWrap;
        content.$lineElement = $line;
        content.$stopElement = $stop;
        content.$vehicleElement = $vehicle;
        content.$vehicleLockElement = $iconLock;

        return content;
    }

    function createArrows$()
    {
        const $arrows = $("<div/>")
                .addClass("arrows")               

        const $arrow1 = $("<div/>")
            .addClass("arrows__arrow")
            .addClass("arrows__arrow-no-fade")           
            .appendTo($arrows);

        const $arrow2 = $("<div/>")
            .addClass("arrows__arrow")  
            .addClass("arrows__arrow-fade")      
            .appendTo($arrows);

        const $arrow3 = $("<div/>")
            .addClass("arrows__arrow")  
            .addClass("arrows__arrow-fade-more")             
            .appendTo($arrows);

        return $arrows;
    }

    function createStopList$(stops, line)
    {
        const $arrStops = [];

        stops.forEach((stop, index) =>
        {
            const $stop = $("<div/>")
                .addClass("stop")
                .attr("data-id", stop.id)
                .click(function()
                {
                    toggleTimeschedule(stop, line);
                })
                .mouseover(function()
                {
                    const feature = routeProcessor.getStopFeature(stop.id);
                    feature.set("highlight", true);
                })
                .mouseout(function()
                {
                    const feature = routeProcessor.getStopFeature(stop.id);
                    feature.set("highlight", false);
                });

            const $header = $("<div/>")
                .addClass("stop__header")
                .appendTo($stop);

            const $identity = $("<div/>")
                .appendTo($header);

            const $name = $("<span/>")
                .addClass("stop__name")
                .text(stop.name)
                .appendTo($identity);

            if (index === 0 || index === stops.length - 1)
            {
                $name.addClass("stop__name--large");
                $name.addClass("stop__name--highlight");
            }

            if (index < stops.length - 1)
            {
                const $control = $("<div/>")
                    .addClass("stop__control")
                    .appendTo($header);

                const $toggle = $("<span/>")
                    .addClass("stop__toggle")
                    .addClass("glyphicons glyphicons-chevron-down")
                    .appendTo($control);
            }

            $arrStops.push($stop);
        });

        return $arrStops;
    }

    function createVehicleStopList$(vehicle, stops, route)
    {        
        const activeTripData = getActiveTripData(vehicle);
        const computed = computeActiveTripAttributes(route.segments, activeTripData);       
        const $arrStops = [];

        if(stops && Array.isArray(stops))
        {
            stops.forEach((stop, index) =>
            {
                const $stop = $("<div/>")
                    .addClass("stop stop--hover-off")
                    .attr("data-id", stop.platformId)
                    .click(function() {

                    });

                const $header = $("<div/>")
                    .addClass("stop__header")
                    .appendTo($stop);

                const $identity = $("<div/>")
                    .appendTo($header);

                if (index === computed.actualSegmentOrder)
                {
                    $stop.addClass("stop--active");

                    const transportType = pis.transportType.getForVehicle(vehicle.tv);

                    //TODO zjednotit do pis
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

                    const $icon = $("<img/>")
                        .addClass("stop__header-image")
                        .attr("src", `img/map/${iconName}.png`)
                        .appendTo($identity);
                }           

                const $name = $("<span/>")
                    .addClass("stop__name")
                    .text(stop.stopName)
                    .appendTo($identity);

                if (index === 0 || index === stops.length - 1)
                {
                    $name.addClass("stop__name--large");
                    $name.addClass("stop__name--highlight");
                }

                const $control = $("<div/>")
                    .addClass("stop__control")
                    .appendTo($header);

                const $time = $("<span/>")
                    .addClass("stop__time")
                    .appendTo($control);

                const $min = $("<span/>")
                    .addClass("stop__time-minute")
                    .appendTo($control);

                //TODO !!! upravit rest alebo offset casova zona - 1hod(3600000ms)                      

                let time;          

                if (index < computed.actualSegmentOrder)
                {
                    // time = new Date(stop.departureTime * 1000 - 3600000);
                    // min = time.getHours() < 12 ? " AM" : " PM";
                    //time = wh.dateTimeToHHMM(time);              
                    if (stop.realDepartureInSecondsFromMidnight >= 0)
                    {
                        time = wh.numberToDaytimeHHMM(stop.realDepartureInSecondsFromMidnight);
                    }
                    else
                    {
                        time = local("map.no-data");
                    }
                    
                    $time.addClass("stop__time--past");
                    $min.hide();               
                }
                else
                {   
                    //console.log(index + 1, computed.timeToNextStopInSec, parseInt(computed.timesToNextStopsInSec[index + 1] / 60));
                    time = parseInt(computed.timesToNextStopsInSec[index] / 60);
                    // time = (stop.departureTime * 1000 - 3600000 - actualTime) / 1000 / 60;
                    // time += (vehicle.d || 0) / 60;
                    //time = parseInt(time);                

                    if (index === computed.actualSegmentOrder)
                    {
                        const $arrows1 = createArrows$()
                            .insertBefore($name);
                        const $arrows2 = createArrows$().children()
                            .addClass("invert")
                            .insertAfter($name);
                        
                        //TODO css
                        $name.css("margin-left", "15px");
                        $name.css("margin-right", "15px");
                        $control.addClass("stop__control--active");
                    }

                    $min.text(` min`);
                }

                $time.text(`${time}`);            

                $arrStops.push($stop);
            });
        }

        return $arrStops;
    }

    function createStopPlatformsBar$(stopName, options)
    {

        const $platforms = $("<div/>")
            .addClass("result__header-strip");

        let platforms = pis.data.stopsGroupedByName.get(stopName);

        if(platforms !== undefined) {
            platforms.sort((s1, s2) =>
            {
                if (parseInt(s1.platf) < parseInt(s2.platf))
                   return -1;
                if (parseInt(s1.platf) > parseInt(s2.platf))
                    return 1;
                if (s1.platf.length < s2.platf.length)
                    return -1;
                if (s1.platf.length > s2.platf.length)
                    return 1;
                return 0;
            });

            platforms = [...platforms];
            platforms.unshift(
            {
                platf: "*"//local("map.all")
            });

            platforms.forEach(stop =>
            {
                //TODO css classy
                const $descriptionMainPlatf = $("<span/>")
                    .addClass("result__header-strip-item")
                    .html(`[ ${stop.platf} ]`)
                    .appendTo($platforms);

                if (stop.platf === "*")
                {
                    $descriptionMainPlatf.attr("title", local("map.all-platforms"));
                }

                if (options && options.platformClickCalback)
                {
                    $descriptionMainPlatf.click(() => options.platformClickCalback(stop));
                }
            });
        }

        return $platforms;
    }

    function toggleTimeschedule(stop, line)
    {
        /*  Stops have different id in both directions (stop id is unique for each platform)
         *  If there exists the same stop platform for both directions, then pick the first direction
         */

        const $stopsForward = $searchResultDetail.find(".stops[data-direction=1]");
        const $stopsBackward = $searchResultDetail.find(".stops[data-direction=0]");
        const visibleDirection = $stopsForward.is(":visible") ? 1 : 0;
        let directionsMatch = true;
        let $stop;

        if (visibleDirection === 1)
        {
            $stop = $stopsForward.find(".stop[data-id=" + stop.id + "]");
        }
        else
        {
            $stop = $stopsBackward.find(".stop[data-id=" + stop.id + "]");
        }

        if (!$stop.length)
        {
            directionsMatch = false;
            $stop = visibleDirection ?
                $stopsForward.find(".stop[data-id=" + stop.id + "]") :
                $stopsBackward.find(".stop[data-id=" + stop.id + "]");
            $stopsForward.toggle();
            $stopsBackward.toggle();
        }

        const $stops = $stop.closest(".stops");
        const feature = routeProcessor.getStopFeature(stop.id);
        let $timescheduleWrap = $stop.find(".timeschedule-wrap");

        const hideOther = function()
        {
            $(".timeschedule-wrap").not($timescheduleWrap.get(0))
                .slideUp("fast")
                .closest(".stop")
                .removeClass("stop--hover-off")
                .find(".stop__toggle")
                .removeClass("glyphicons-chevron-up")
                .addClass("glyphicons-chevron-down")
                .closest(".stop")
                .find(".stop__name:not(.stop__name--large)")
                .removeClass("stop__name--highlight");
        }

        if ($timescheduleWrap.length && $timescheduleWrap.is(":visible"))
        {
            $timescheduleWrap.slideUp("fast", function()
            {
                $(this).remove();
            });

            $stop.removeClass("stop--hover-off")
            $stop.find(".stop__toggle")
                .removeClass("glyphicons-chevron-up")
                .addClass("glyphicons-chevron-down");
            $stop.find(".stop__name:not(.stop__name--large)")
                .removeClass("stop__name--highlight");

            popup.hide();

            return;
        }
        else
        {
            // mapExtender.fit(feature.getGeometry(),
            // {
            //     maxZoom: stopProcessorMaxZoom,
            //     duration: fitDuration,
            //     padding: getMapPadding()
            // });
        }

        if (stop.id === parseInt($stops.find("div.stop").last().attr("data-id")))
        {
            hideOther();

            popup.setHeader(stop.name);
            popup.setReferenceId(stop.id);
            popup.setContent();
            popup.toggleClass("stop-popup--top-higher", true);
            popup.setPosition(feature.getGeometry().getCoordinates());

            return;
        }

        //const promise1 = axGetStopRouteSchedule(stop.id, line.routes[0].id);
        const promise1 = axGetPlatformLineSchedule(stop.id, line.id);
        const promise2 = axGetDeparturesOnPlatformWeb(stop.id);
        const promise3 = axGetAnnouncementsRepeat(stop.id);

        waitMe($stop, "show",
        {
            maxSize: 36
        });

        Promise.all([promise1, promise2, promise3])
            .then(resolve =>
            {
                waitMe($stop, "hide");

                const timeschedule = resolve[0];
                const departures = (resolve[1] && resolve[1].departures
                        ? resolve[1].departures 
                        : []);
                const announcements = (resolve[2] && resolve[2].announcements ?
                    resolve[2].announcements : []);

                //#region stop schedule on line

                //console.log(stop.id, $stop);
                if (!timeschedule || !timeschedule.trips.length)
                {
                    ajaxState = "inactive";
                    return;
                }

                $stop.addClass("stop--hover-off");
                $stop.find(".stop__name")
                    .addClass("stop__name--highlight");
                $timescheduleWrap.remove();
                $timescheduleWrap = $("<div/>")
                    .addClass("timeschedule-wrap")
                    .click(function(e)
                    {
                        e.stopPropagation();
                    })
                    .appendTo($stop);

                const $timescheduleFlex = $("<div/>")
                    .addClass("timeschedule-flex")
                    .appendTo($timescheduleWrap);
                const $timeschedule = createTimeSchedule$(timeschedule, true)
                    .appendTo($timescheduleFlex);
                const $actionBar = $("<div/>")
                    .addClass("stop__action-bar")
                    .appendTo($timescheduleWrap);
                const $print = $("<span/>")
                    .addClass("button")
                    .addClass("glyphicons glyphicons-print")
                    .click(function(e)
                    {
                        e.stopPropagation();
                        printTimeSchedule(stop, timeschedule);
                    })
                    .appendTo($actionBar);

                if ($timescheduleWrap.is(":hidden"))
                {
                    hideOther();
                }
                $timescheduleWrap.slideDown("fast", function()
                    {
                        //console.log($this, $this.position().top, $stops.scrollTop());
                        $stops.animate(
                        {
                            scrollTop: $stop.position().top + $stops.scrollTop()
                        }, 200, "swing");
                    })
                    .closest(".stop")
                    .find(".stop__toggle")
                    .removeClass("glyphicons-chevron-down")
                    .addClass("glyphicons-chevron-up");

                //#endregion                                                           

                const feature = routeProcessor.getStopFeature(stop.id);
                const pisStop = pis.data.getStop(stop.id);
                showStopPopupDepartures([pisStop], feature, departures, announcements);
            })
            .catch((error1, error2) =>
            {
                ajaxState = "inactive";
                console.log(error1, error2);
            });
    }

    function createTimeSchedule$(timeschedule, split)
    {
        const trips = timeschedule.trips;
        const dt = new Date();
        let actualTime = timeschedule.actualTime;
        let $stopTimeScheduleOnRoute = $();
        let $row;
        let $cellMM;

        trips.sort(wh.comparable("time"));

        const firstHour = wh.getTimeParts(trips[0].time).hours;
        const lastHour = wh.getTimeParts(trips[trips.length - 1].time).hours;
        const rowCount = lastHour - firstHour + 1;
        let rowNum = 0;
        let lastHoursPart = firstHour - 1;

        let $timeschedule = $("<div/>")
            .addClass("timeschedule");
        $stopTimeScheduleOnRoute = $stopTimeScheduleOnRoute.add($timeschedule);

        trips.forEach((routeTrip) =>
        {
            const timeParts = wh.getTimeParts(routeTrip.time);

            //New row
            if (timeParts.hours !== lastHoursPart)
            {
                /*
                for (let i = lastHoursPart; i < timeParts.hours; i++)
                {
                    */
                    /*
                    if (split && rowNum >= Math.ceil(rowCount / 2) && $stopTimeScheduleOnRoute.length === 1)
                    {
                        $timeschedule = $("<div/>")
                            .addClass("timeschedule timeschedule--part-two");
                        $stopTimeScheduleOnRoute = $stopTimeScheduleOnRoute.add($timeschedule);
                    }
                    */

                    $row = $("<div/>")
                        .addClass("timeschedule__row")
                        .appendTo($timeschedule);

                    $cellHH = $("<div/>")
                        .addClass("timeschedule__cell-hh")
                        .text(wh.addLeadingZeroes(timeParts.hours))
                        .appendTo($row);

                    $cellMM = $("<div/>")
                        .addClass("timeschedule__cell-mm")
                        .appendTo($row);

                    rowNum++;
                //}
            }

            //Add time value
            const $timePartMM = $("<span/>")
                .addClass("timeschedule__cell-mm-value")
                .text(wh.addLeadingZeroes(timeParts.minutes))
                .appendTo($cellMM);

            //Highlight next closest time
            if (actualTime && routeTrip.time > actualTime)
            {
                $timePartMM.addClass("timeschedule__cell-mm-value--closest");
                actualTime = null;
            }

            lastHoursPart = timeParts.hours;
        });

        if (rowNum % 2)
        {
            $row = $("<div/>")
                .addClass("timeschedule__row")
                .appendTo($timeschedule);
            $cellHH = $("<div/>")
                .addClass("timeschedule__cell-hh")
                .text(wh.addLeadingZeroes(lastHour + 1))
                .appendTo($row);
            $cellMM = $("<div/>")
                .addClass("timeschedule__cell-mm")
                .appendTo($row);
        }

        return $stopTimeScheduleOnRoute;
    }

    function printTimeSchedule(stop, stopTimeScheduleOnRoute)
    {
        const $timeschedule = createTimeSchedule$(stopTimeScheduleOnRoute);
        const printWindow = window.open('', '_blank');

        printWindow.document.write('<html><head><title>' + stop.name + '</title>');
        printWindow.document.write('<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,600,300,300italic,400italic,600italic,700italic&amp;subset=latin,vietnamese,latin-ext" rel="stylesheet" type="text/css">');
        printWindow.document.write('<link href="' + pis.settings.printStyleUrl + '" media="all" rel="stylesheet" type="text/css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>' + stop.name + '</h1>');
        printWindow.document.write($timeschedule.get(0).outerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close(); // necessary for IE >= 10
        printWindow.focus(); // necessary for IE >= 10*/

        setTimeout(() =>
        {
            printWindow.print();
            printWindow.close();
        }, 1);
    }

    function showStopPopupDepartures(stops, feature, departures, announcements)
    {
        const clearAjax = () =>
        {
            clearTimeout(mapAjaxCalls.stopDeparturesTimeout);
            if (mapAjaxCalls.stopDeparturesAjax)
            {
                mapAjaxCalls.stopDeparturesAjax.forEach(call => call.abort());
                delete mapAjaxCalls.stopDeparturesAjax;
            }
            popup.event.off("hide");
        };

        clearAjax();
        //console.log("clearAjax", stopId, mapAjaxCalls.stopDeparturesTimeout, mapAjaxCalls.stopDeparturesAjax);
               
        const collapsedCount = 6;  
        const $popupContentElement = popup.getContentElement$();
        const isStopPlatform = stops.length === 1;
        const firstStop = stops[0];             

        let $popupContent = createStopPopupDepartures$(stops, departures, announcements, popup);       
        let headerText = firstStop.name;
        
        if (isStopPlatform)
        {
            headerText += ` [${firstStop.platf}]`;
        }       
            
        popup.setReferenceId(firstStop.name);
        popup.toggleClass("stop-popup--top-higher", routeProcessor.isFirstOrLastStop(feature));
        popup.setPosition(feature.getGeometry().getCoordinates());
        popup.event.on("hide", () =>
        {
            clearAjax();
        });       

        const updateCollapsibleContent = ($popupContent) =>
        {
            const $rows = $popupContent.find("tr.departure");

            if ($rows.length <= collapsedCount)
            {
                popup.setHeader(headerText);
                return;
            }                  

            const isExpanded = $popupContentElement.attr("data-state") === "expanded";

            if (!isExpanded)
            {
                $rows.filter(":gt(" + (collapsedCount - 1) + ")")
                    .hide();                
            }
            
            const $header = $("<div>")
                .text(headerText);                

            const $icon = $("<span/>")
                .addClass("stop-popup__item-icon")
                .addClass("glyphicons")
                .addClass(() => 
                {
                    if (isExpanded)
                    {
                        return "glyphicons-chevron-up";
                    }
                    else
                    {
                        return "glyphicons-chevron-down";
                    }
                })
                .css("float", "right")
                .css("cursor", "pointer")
                .attr("title", local("map.view-more"))                
                .appendTo($header)
                .click((el) => 
                {                                                            
                    const state = $popupContentElement.attr("data-state");

                    if (state === "expanded")
                    {            
                        $popupContentElement.removeAttr("data-state");
                        $popupContent.find("tr.departure").slice(collapsedCount).hide();
                        $icon.addClass("glyphicons-chevron-down");
                        $icon.removeClass("glyphicons-chevron-up");
                        return;
                    }

                    $popupContentElement.attr("data-state", "expanded");
                    $popupContent.find("tr.departure").show();
                    $icon.addClass("glyphicons-chevron-up");
                    $icon.removeClass("glyphicons-chevron-down");
                });                

            popup.setHeader($header);    
        };

        updateCollapsibleContent($popupContent);
        popup.setContent($popupContent);

        const refreshDepartures = () =>
        {
            const stopIds = stops.map(stop => stop.id);
            const promises = [];
            const promise1 = axGetDeparturesOnPlatformWeb(...stopIds);

            promises.push(promise1);

            if (isStopPlatform)
            {
                const promise2 = axGetAnnouncementsRepeat(stopIds[0]);
                promises.push(promise2);
            }

            mapAjaxCalls.stopDeparturesAjax = promises;

            Promise.all(promises)
                .then(resolve =>
                {       
                    let departures;
                    
                    if (isStopPlatform)
                    {
                        departures = (resolve[0] && resolve[0].departures
                            ? resolve[0].departures 
                            : []);
                    }
                    else
                    {
                        departures = resolve[0] && resolve[0].departures
                            ? resolve[0].departures
                            : {};
                        //departures = processMultipleStopDepartures(departuresData); 
                    }                 
                                                                  
                    const announcements = isStopPlatform ? resolve[1].announcements : null;

                    $popupContent = createStopPopupDepartures$(stops, departures, announcements, popup);
                    updateCollapsibleContent($popupContent);
                    popup.setContent($popupContent);

                    showStopDepartures(departures);

                    mapAjaxCalls.stopDeparturesTimeout = setTimeout(refreshDepartures, 5000);
                })
                .catch((error1, error2) =>
                {
                    //console.log("error", stopId, error1, error2);

                    if (error1.statusText !== "abort")
                    {
                        mapAjaxCalls.stopDeparturesTimeout = setTimeout(refreshDepartures, 5000);
                    }
                })
                .finally(() =>
                {
                    //console.log("finally", stopId);
                    //mapAjaxCalls.stopDeparturesTimeout = setTimeout(refreshDepartures, 5000);

                });
        };

        mapAjaxCalls.stopDeparturesTimeout = setTimeout(refreshDepartures, 5000);
    }

    //TODO uz je to komplikovane, zapuzdrit do objektu
    function createStopPopupDepartures$(stops, departures, announcements, popup)
    {
        const $table = $("<table/>")
            .addClass("stop-popup__content-table");

        //Header
        const $headerRow = $("<tr/>")
            .appendTo($table);

        let $headerCell = $("<th/>")
            .appendTo($headerRow);

        $("<span/>")
            .addClass("stop-popup__close-icon")
            .addClass("glyphicons glyphicons-remove")
            .click(function()
            {
                popup.getContainer$().slideUp("fast", function()
                {
                    popup.hide();
                    $(this).show();
                });
            })
            .appendTo($headerCell);

        $headerCell = $("<th/>")
            .appendTo($headerRow);

        $("<span/>")
            .text(local("map.line"))
            .appendTo($headerCell);

        $headerCell = $("<th/>")
            .appendTo($headerRow);

        $("<span/>")
            .text(local("map.heading"))
            .appendTo($headerCell);

        $headerCell = $("<th/>")
            //.addClass("stop-popup__content-item-time")
            .appendTo($headerRow);

        const $departureHeader = $("<span/>")
            .text(() => 
            {
                let text = local("map.departure");
                
                if (stops.length > 1)
                {
                   text += ` [${local("map.platform-abbr").toLowerCase()}]`;
                }

                return text;               
            })        
            .appendTo($headerCell);       

        if (!departures.length)
        {
            let $row = $("<tr/>")
                .appendTo($table);

            let $cell = $("<td/>")
                .appendTo($row);

            $("<span/>")
                .addClass("stop-popup__item-icon")
                .addClass("glyphicons glyphicons-bus")
                .appendTo($cell);

            $cell = $("<td/>")
                .attr("colspan", 3)
                .appendTo($row);

            $("<span/>")
                .text(local("map.no-departures"))
                .appendTo($cell);
        }       
           
        //const transportType = pis.transportType.getAllForStop(stop.platformKind);

         //TODO dat do options 
        const totalCount = 10;

        departures.sort(wh.comparable("real", { sortOrder: "descending" }));
        departures.splice(0, departures.length - totalCount);
        departures.reverse();

        departures.forEach((departure, index) =>
        {
            let $row = $("<tr/>")
                .addClass("departure")
                .appendTo($table);

            let $cell = $("<td/>")
                .appendTo($row);

            const $icon = $("<span/>")
                .addClass("stop-popup__item-icon")
                .appendTo($cell);           

            // const vehicleType = departure.realTimePaired
            //     ? departure.typeVehicle
            //     : departure.typeLine;
            // const transportType = pis.transportType.getForVehicle(vehicleType);
            const transportType = pis.transportType.getForLine(departure.typeLine);
            
            switch (transportType)
            {
                case pis.TransportType.BUS:
                    //$icon.addClass("glyphicons glyphicons-bus");
                    $icon.addClass("list-header__item-icon list-header__item-icon--smaller list-header__item-icon--bus");
                    break;
                case pis.TransportType.TROLLEY:
                    //TODO vyrobit samostatne classy pre stop departure
                    //TODO pohrat sa s tym svgckom, je prilis velke, rozsiruje padding td
                    $icon.addClass("list-header__item-icon list-header__item-icon--smaller list-header__item-icon--trolleybus");
                    break;
                case pis.TransportType.TRAM:
                    //$icon.addClass("glyphicons glyphicons-train");
                    $icon.addClass("list-header__item-icon list-header__item-icon--smaller list-header__item-icon--tram");
                    break;
            }

            $cell = $("<td/>")
                .appendTo($row);

            $("<span/>")
                .addClass("popup__item-link")
                .html(departure.lineNumberText)
                .click(() =>
                {
                    const stopId = stops.length > 1
                        ? departure.stopId
                        : stops[0].id;                  


                    let line = pis.data.getLineByLineId(departure.lineId);

                    if(Array.isArray(line) && !line.length) {
                        line = pis.data.getLineByLineNumberText(departure.lineNumberText);
                    }

                    showSelectedLine(line, 
                    { 
                        stopId: stopId, 
                        routeNumber: departure.routeNumber,
                        platformId: departure.platformId
                    });
                })
                .appendTo($cell);

            $cell = $("<td/>")
                .appendTo($row);

            $("<span/>")
                .html(`${departure.destinationName}`)
                .appendTo($cell);

            $cell = $("<td/>")
                //.addClass("stop-popup__content-item-time")
                .appendTo($row);

            $("<span/>")
                .html(() =>
                {
                    let time;

                    if (departure.realTimePaired)
                    {
                        time = Math.max(Math.floor(departure.real / 60), 0) + " Min";
                    }
                    else
                    {
                        time = wh.numberToDaytimeHHMM(departure.plan);
                    }                   

                    if (stops.length > 1)
                    {
                        time += ` [ ${ departure.platformNumber } ]`;
                    }                    

                    return time;
                })
                .appendTo($cell);            
        });        

        if (announcements && announcements.length)
        {
            let $row = $("<tr/>")
                .appendTo($table);

            // let $cell = $("<td/>")
            //     .appendTo($row);

            // $("<span/>")
            //     .addClass("stop-popup__item-icon")
            //     .addClass("glyphicons glyphicons-display")
            //     .appendTo($cell);

            $cell = $("<td/>")
                .addClass("stop-popup__content-td--communication")
                .attr("colspan", "4")
                .appendTo($row);

            $text = $("<span/>")
                .addClass("stop-popup__item-communication")
                .appendTo($cell);

            let text = "";
            announcements.forEach((announcement, index) =>
            {
                if (index)
                {
                    text += "\n\n";
                }

                text += announcement.text;
            });

            $text.text(text);
        }

        return $table;
    }

    function showStopDepartures (departures)
    {
        let $departuresResult = $searchResultMain.find(".result__departures");
        let visible = true;

        if($departuresResult.length && !$departuresResult.is(':visible')) {
            visible = false;
        }

        $searchResultMain.find(".result__departures").remove();

        $departuresResult = $('<div/>')
            .addClass('result__departures')
            .appendTo($searchResultMain);

        if(!visible) {
            $departuresResult.hide();
        }

        const linesMap = new Map();

        departures.forEach(departure => {

            if(linesMap.has(departure.lineId)) {
                const time = linesMap.get(departure.lineId);

                if(time.count === 3) {
                    return;
                }

                const timeText = departure.realTimePaired ? Math.max(Math.floor(departure.real / 60), 0) + " min" : wh.numberToDaytimeHHMM(departure.plan);
                time.count++;
                time.element.text(time.element.text() + (time.count !== 1 ? ', ' : '') + timeText);

                return;
            }

            const $resultHeader = $("<div/>")
                .addClass("result__item")
                .click(function()
                {
                    showSelectedLine(
                    { //hack
                        id: departure.lineId,
                        lineNumberText: departure.lineNumberText
                    }, { routeNumber: departure.routeNumber, platformId: departure.platformId, platformName: departure.platformName });
                })
                .appendTo($departuresResult);

            const $info = $("<div/>")
                .addClass("result__info")
                .appendTo($resultHeader);


            const $left = $("<div/>")
                .appendTo($info);

            const $label = createLineHeaderInfoLabel(departure.lineNumberText)
                .appendTo($left);


            const $right = $("<div/>")
                .addClass("result__info-description")
                .appendTo($info);

            const $descriptionHeader = $('<span/>')
                .addClass('result__info-description-header')
                .text(local("destinationStop"))
                .appendTo($right);

            const $descriptionMain = $("<span/>")
                .addClass("result__info-description-main")
                //.html(line.startName + " &rarr; " + line.endName)
                .html(departure.destinationName)
                .appendTo($right);

            const $times = $('<div/>')
                .addClass('result__info-times')
                .appendTo($info);

            const $closestTime = $('<div/>')
                .addClass('result__info-closest-time')
                .text(departure.realTimePaired ? Math.max(Math.floor(departure.real / 60), 0) + " min" : wh.numberToDaytimeHHMM(departure.plan))
                .appendTo($times);

            const $nextTimes = $('<div/>')
                .addClass('result__info-next-times')
                .appendTo($times);

            linesMap.set(departure.lineId, {
                count: 0,
                element: $nextTimes
            });
        })
    }

    function showVehiclePopup(vehicleId, options)
    {
        const isDisplayedOnRoute = routeProcessor.isShown() && routeProcessor.getVehicleFeature(vehicleId) !== undefined;
        const popupReferenceId = vehiclePopup.getReferenceId();
        let followedVehicleId;

        vehiclePopup.setReferenceId(vehicleId);
        // vehiclePopup.getContainer$()
        //     .toggleClass("vehicle-popup--higher", isDisplayedOnRoute);

        //TODO parameter processor (ak je na trase ale aj normal, moze zmiznut z mapy)

        const vehicle = pis.data.getVehicle(vehicleId);
        let line = pis.data.getLineByLineId(vehicle.lnid);

        if(Array.isArray(line) && line.length === 0) {
            line = pis.data.getLineByLineNumberText(vehicle.ln);
        }

        const lineRoute = line.routes.find(route => route.name === vehicle.rn);


        const pan = () =>
        {
            //TODO iba ak je zmena gps
            const extent = ol.extent.boundingExtent([vehiclePopup.getPosition()]);
            mapExtender.fit(extent,
            {
                maxZoom: mapExtender.getZoom(),
                duration: fitDuration,
                padding: getMapPadding()
            });
        }

        const update = (vehicles, line, optRouteSegments) =>
        {
            const vehicle = vehicles.find(vehicle => vehicle.vid === vehicleId);

            if (!vehicle)
            {
                vehiclePopup.hide();
                return;
            }

            const popupContent = createVehiclePopupContent(vehicle, line, optRouteSegments);
            let latitude = vehicle.la * wertyz.gps.COORDINATES_MULTIPLICATOR;
            let longitude = vehicle.lo * wertyz.gps.COORDINATES_MULTIPLICATOR;

            if (isDisplayedOnRoute && routeProcessor._routes.length && vehicle.rn && vehicle.spi)
            {
                const route = routeProcessor._routes.find(route => route.name === vehicle.rn);
                //todo dat do global fcie             
                const segment = pis.data.getRouteSegment(route, vehicle.spi);
                const snapPositionData = routeProcessor._computeSnapPositionData(latitude, longitude, segment.points);

                if (snapPositionData.distance <= 20)
                {
                    latitude = snapPositionData.latitude;
                    longitude = snapPositionData.longitude;
                }
            }

            const cords = ol.proj.fromLonLat([longitude, latitude]);

            if (isDisplayedOnRoute && vehiclePopup.getReferenceId() === popupReferenceId)
            {
                vehiclePopup.animatePosition(cords,
                {
                    duration: 300
                });
            }
            else
            {
                popupContent.$lineElement.addClass("popup__item-link")
                    .click(() =>
                    {
                        showSelectedLine(line, { routeNumber: vehicle.rn });
                    });

                vehiclePopup.setPosition(cords);
            }

            vehiclePopup.setContent(popupContent.$element);

            if (!optRouteSegments)
            {
                waitMe(popupContent.$stopElement, "show",
                {
                    maxSize: 28
                });
            }
            else
            {
                waitMe(popupContent.$stopElement, "stop");
            }            

            popupContent.$vehicleElement.click(() =>
            {
                
            });

            popupContent.$vehicleLockElement.click((e) => 
            {                            
                $(e.currentTarget).toggleClass("glyphicons-unlock")
                    .toggleClass("glyphicons-lock")
                    .toggleClass("color-alert");

                if (followedVehicleId)
                {
                    followedVehicleId = null;
                    return;
                }
                
                followedVehicleId = vehicle.vid;
               
                pan();

                const refresh = axGetAllRtdVehicles_Loop.event.on("refresh", () =>
                {
                    if (!followedVehicleId ||
                        !vehiclePopup.getPosition() ||
                        vehiclePopup.getReferenceId() !== followedVehicleId)
                    {
                        axGetAllRtdVehicles_Loop.event.off("refresh", refresh);
                        return;
                    }

                    pan();
                });

                vehiclePopup.event.on("hide", () =>
                {
                    followedVehicleId = null;
                });
            })

            if (followedVehicleId)
            {
                popupContent.$vehicleLockElement.removeClass("glyphicons-unlock")
                    .addClass("glyphicons-lock")
                    .addClass("color-alert");
            }          
        }
       
        update(pis.data.vehicles, line);
        pan();

        const axGetRoutePromise = axGetRoute(line.id, lineRoute.id)
            .done((data) =>
            {

                /*if(!(data.lines && data.lines[0] && data.routes && data.routes[0]))
                    return;*/

                const route = data.lines[0].routes[0];

                const isActiveAndValid = () => 
                {
                    const vehicle = pis.data.getVehicle(vehicleId);

                    return vehicle 
                        && vehiclePopup.getPosition() 
                        && vehiclePopup.getReferenceId() === vehicleId
                };

                const isTheSameRoute = () => 
                { 
                    const vehicle = pis.data.getVehicle(vehicleId);
                    return vehicle && vehicle.rn === route.name;
                };

                if (!isActiveAndValid())
                    return;               

                if (!isTheSameRoute())
                {
                    const vehicle = pis.data.getVehicle(vehicleId);

                    if (!vehicle)
                        return;

                    showVehiclePopup(vehicleId, options);
                    
                    return;
                }

                const updateCallback = axGetAllRtdVehicles_Loop.event.on("refresh", (vehicles) =>
                {                    
                    if (!isActiveAndValid() || !isTheSameRoute())
                    {                       
                        axGetAllRtdVehicles_Loop.event.off("refresh", updateCallback);                      

                         if (!isActiveAndValid())
                            return;   

                        if (!isTheSameRoute())
                        {       
                            const vehicle = pis.data.getVehicle(vehicleId);

                            if (!vehicle)
                                return;                                    

                            //The same vehicle on different route                          
                            showVehiclePopup(vehicleId, options);                            
                        }

                        return;
                    }                 
                                        
                    update(vehicles, line, route.segments);
                });

                vehiclePopup.event.on("hide", () =>
                {
                    axGetAllRtdVehicles_Loop.event.off("refresh", updateCallback);                    
                });

                update(pis.data.vehicles, line, route.segments);
            });
        
        return axGetRoutePromise;
    }

    function createMapOfGroupedStops(stops)
    {
        const map = new Map();

        for (const stop of stops)
        {
            if (map.has(stop.name2))
            {
                map.get(stop.name2).push(stop);
            }
            else
            {
                map.set(stop.name2, [stop]);
            }
        }

        return map;
    }

    function getActiveTripData(vehicle)
    {
       const activeTripData = 
       {
            timeToTripStart: vehicle.pdf,
            segmentPointId: vehicle.spi
       };

       return activeTripData;
    }

    //todo poupratovat
    //either activeTripData.timeToTripStart or activeTripData.segmentPointId must be set to compute attributes
    function computeActiveTripAttributes(segments, activeTripData)
    {     
        const computed = {};
        computed.timesToNextStopsInSec = {};
        computed.finalStopName = segments[segments.length - 1].endPlatformName;

        let actualSegmentOrder;
        let timeToNextStopInSec;
        //TODO zmenit na pis.data.getRouteSegment       

        if (activeTripData.timeToTripStart)
        {//vehicle is waiting to get on trip physicaly, though the trip in obu is already set
            actualSegmentOrder = 0;
            timeToNextStopInSec = activeTripData.timeToTripStart;            
            computed.nextStopName = segments[0].startPlatformName;
            computed.timeToNextStopInSec = activeTripData.timeToTripStart;             
        }
        else
        {//vehicle is physicaly on the trip and passed the first stop already
            const vehicleSegment = segments.find(s => s.points.some(p => p.segmentPointId === activeTripData.segmentPointId));

            if (!vehicleSegment)
                return computed;
            
            const passedSegmentPoint = vehicleSegment.points.find(p => p.segmentPointId === activeTripData.segmentPointId);

            actualSegmentOrder = vehicleSegment.segmentOrder;
            timeToNextStopInSec = vehicleSegment.segmentTime - passedSegmentPoint.timeOnSegment;
            computed.nextStopName = vehicleSegment.endPlatformName;
            computed.timeToNextStopInSec = timeToNextStopInSec;            
        }

        computed.actualSegmentOrder = actualSegmentOrder;
        computed.timesToNextStopsInSec[actualSegmentOrder] = timeToNextStopInSec;

        const nextSegments = segments
            .filter(segment => segment.segmentOrder > actualSegmentOrder);
            //.sort(wh.comparable("segmentOrder"));

        nextSegments.forEach(segment =>
        {            
            timeToNextStopInSec += segment.segmentTime;
            computed.timesToNextStopsInSec[segment.segmentOrder] = timeToNextStopInSec;
        });

        return computed;
    }

    function resetView()
    {
        clearMapAsyncCalls();
        mapActionHandlers.clear();

        if(view.getState() !== view.State.LINE_SCHEDULES) {
            popup.hide(); 
        }

        
        stopPopupStart.hide();
        

        stopPopupEnd.hide();
        vehiclePopup.hide();

        routeProcessor.clear();       
        stopProcessor.show();
        vehicleProcessor.show();
        // stopProcessor.fit(
        // {
        //     padding: getMapPadding()
        // });  

        $sidebar.addClass("sidebar--empty");
        view.reset();
    }

    function clearMapAsyncCalls()
    {
        if(view.getState() !== view.State.LINE_SCHEDULES) {
            clearTimeout(mapAjaxCalls.stopDeparturesTimeout);
        }
        axGetAllRtdVehicles_Loop.event.offExcept("refresh", mapAjaxCalls.refreshVehiclesCallback);
    }

    function getMapPadding()
    {
        //TODO cele prerobit aj so "sidebar--empty";
        const mapPadding = $sidebar.hasClass("sidebar--empty") ? [0, 0, 0, 0] : [0, 500, 0, 0];

        return mapPadding;
    }

    function waitMe(element, action, options)
    {
        const $element = $(element);

        if (action === "show")
        {
            const opt = {
                effect: "ios", //progressBar, roundBounce, facebook, ios, rotation, win8, win8_linear                                      
                bg: "rgba(255, 255, 255, 0.7)",
                fontSize: "16px",
                color: "gray"
            };

            if (options && options.maxSize)
                opt.maxSize = options.maxSize;

            if (options && options.text)
                opt.text = options.text;

            $element.waitMe(opt);

            return;
        }

        $element.waitMe("hide");
    }

    function local(key)
    {
        return pis.localization.getText("pis." + key);
    }

    function axGetLinesWithRoutes()
    {
        return $.ajax(
            {
                type: "GET",
                url: pis.ajax.getLinesWithRoutes
            })
            .done(function(data)
            {
                if (!data || !data.lines)
                    return;

                //wh.stopwatch.start();
                //DOCASNE, bude sa orderovat v reste
                data.lines.forEach(l =>
                {
                    l.routes.sort(wh.comparable("name"));
                });
                //console.log(wh.stopwatch.elapsed());

                pis.data.lines = data.lines;

                if(pis.settings.mapVehicleLineToLineNumberText) {
                    pis.data.lines.forEach(line => {
                        pis.data.lineNumberMap.set(line.lineNumber, line);
                    });
                }
            })
            .fail(function(error)
            {
                console.log(error);
            })
            .always(function() {});
    }

    function axGetRoute(lineId, routeId)
    {
        return $.ajax(
            {
                type: "POST",
                url: pis.ajax.getRoute,
                data: JSON.stringify(
                {
                    lineId: lineId,
                    routeId: routeId
                })
            })
            .done((data) =>
            {
                if (!data || !data.lines)
                    return;

                const route = data.lines[0].routes[0];

                route.segments.sort(wh.comparable("segmentOrder"));
                route.segments.forEach(s =>
                {
                    s.points.sort(wh.comparable("order"));
                });
            })
            .fail(function(error)
            {
                console.log(error);
            });
    }

    function axGetStopsOnRoute(routeId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getStopsOnRoute,
            data: JSON.stringify(
            {
                routeId: routeId
            })
        });
    }

    function axGetStopsOnTrip(lineNumberText, tripNumber)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getStopsOnTrip,
            data: JSON.stringify(
            {
                lineNumberText: lineNumberText,
                tripNumber: tripNumber
            })
        });
    }

    function axGetPlatformsDataWithHistory(lineNumberText, tripNumber, routeNumber, obuNumber)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getPlatformsDataWithHistory,
            data: JSON.stringify(
            {
                lineNumber: lineNumberText,
                tripNumber: tripNumber,
                routeNumber: routeNumber,
                obuNumber: obuNumber
            })
        });
    }

    function axGetLineStops(lineId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getLineStops,
            data: JSON.stringify(
            {
                lineId: lineId
            })
        });
    }

    function axGetLineStopList(lineId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getLineStopList,
            data: JSON.stringify(
            {
                lineId: lineId
            })
        });
    }

    function axGetStopRouteSchedule(stopId, routeId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getStopRouteSchedule,
            data: JSON.stringify(
            {
                stopId: stopId,
                routeId: routeId
            })
        });
    }

    function axGetStopLineSchedule(stopId, lineId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getStopLineSchedule,
            data: JSON.stringify(
            {
                stopId: stopId,
                lineId: lineId
            })
        });
    }

    function axGetPlatformLineSchedule(platformId, lineId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getPlatformLineSchedule,
            data: JSON.stringify(
            {
                platformId: platformId,
                lineId: lineId
            })
        });
    }

    function axGetTripsOnStops(...stopIds)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getTripsOnStop,
            data: JSON.stringify(
            {
                stopIds: stopIds
            })
        });
    }

    function axGetTripsOnPlatforms(...platformIds)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getTripsOnPlatform,
            data: JSON.stringify(
            {
                platformIds: platformIds
            })
        });
    }


    function axGetDeparturesOnStopWeb(...stopIds)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getDeparturesOnStopWeb,
            data: JSON.stringify(
            {
                stopIds: stopIds
            })
        });
    }

    function axGetDeparturesOnPlatformWeb(...platformIds)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getDeparturesOnPlatformWeb,
            data: JSON.stringify(
            {
                platformIds: platformIds
            })
        });
    }

    function axGetAnnouncementsRepeat(stopId)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getAnnouncementsRepeat,
            data: JSON.stringify(
            {
                stopId: stopId
            })
        });
    }

    function axGetAllStops()
    {
        return $.ajax(
            {
                type: "GET",
                url: pis.ajax.getAllStops
            })
            .done(function(data)
            {
                if (!data || !data.stops)
                    return;

                //TODO doplnit do deklaracie pis.data
                pis.data.stops = data.stops.sort(wh.comparable("name"));
                pis.data.stopsGroupedByName = createMapOfGroupedStops(pis.data.stops);
                pis.data.distinctStops = Array.from(pis.data.stopsGroupedByName.values(), (value) => value[0]);
                //pis.data.distinctStops = wh.distinctBy(data.stops, "name");             
                pis.data.distinctStopNames = wh.distinct(pis.data.distinctStops.flatMap(stop => stop.name));
                pis.data.distinctStopCities = wh.distinct(pis.data.distinctStops.flatMap(stop => stop.city))
                    .filter(city => city.trim() !== "")
                    .sort();
                //debugger;
            })
            .fail(function(error)
            {
                console.log(error);
            })
            .always(function() {});
    }

    function axGetAllPlatforms()
    {
        return $.ajax(
            {
                type: "GET",
                url: pis.ajax.getAllPlatforms
            })
            .done(function(data)
            {
                if (!data || !data.platforms)
                    return;                

                //TODO doplnit do deklaracie pis.data
                pis.data.stops = data.platforms.filter(stop => stop.platformKind).sort(wh.comparable("name"));
                pis.data.stopsGroupedByName = createMapOfGroupedStops(pis.data.stops);
                pis.data.distinctStops = Array.from(pis.data.stopsGroupedByName.values(), (value) => value[0]);
                //pis.data.distinctStops = wh.distinctBy(data.stops, "name");             
                pis.data.distinctStopNames = wh.distinct(pis.data.distinctStops.flatMap(stop => stop.name));
                pis.data.distinctStopCities = wh.distinct(pis.data.distinctStops.flatMap(stop => stop.city))
                    .filter(city => city.trim() !== "")
                    .sort();
                //debugger;
            })
            .fail(function(error)
            {
                console.log(error);
            })
            .always(function() {});
    }

    function axGetAllPlaces ()
    {
        return $.ajax(
            {
                type: 'GET',
                url: pis.ajax.getAllPlaces
            }
        )
        .done(function(data)
        {
            if(!data || !data.data) {
                return;
            }

            pis.data.places = data.data.filter(place => place.points.length === 1);
        })
    }

    function axGetAllLines(lineId)
    {
        return $.ajax(
            {
                type: "POST",
                url: pis.ajax.getAllLines,
                data: JSON.stringify(
                {
                    lineId: lineId
                })
            })
            .done(function(data)
            { //DOCASNE, bude sa orderovat v reste
                if (!data || !data.lines || !data.lines.length || !data.lines[0].routes)
                    return;

                data.lines.forEach(l =>
                {
                    l.routes.sort(wh.comparable("name"));
                });
                data.lines.flatMap(l => l.routes).forEach(r =>
                {
                    r.segments.sort(wh.comparable("segmentOrder"));
                    r.segments.forEach(s =>
                    {
                        s.points.sort(wh.comparable("order"));
                    });
                });
            });
    }

    function axGetAllVehicles()
    {
        return $.ajax(
        {
            type: "GET",
            url: pis.ajax.getAllVehicles
        });
    }

    function axGetAllRtdVehicles()
    {
        return $.ajax(
        {
            type: "GET",
            url: pis.ajax.getAllRtdVehicles
        });
    }

    axGetGeoLocation = function(searchText)
    {
        return $.ajax(
        {
            type: "POST",
            url: pis.ajax.getGeoLocation,
            data: JSON.stringify(
            {
                searchText: searchText
            })
        })        
    }    
});
