wertyz = {};

wertyz.class = new function()
{
    /*abstract class*/
    this.Eventify = function()
    {
        this._eventHandlers = {};

        this.on = function(eventName, eventHandler)
        {
            if (!this.hasRegistered(eventName))
                this._eventHandlers[eventName] = [];

            this._eventHandlers[eventName].push(eventHandler);

            return eventHandler;
        };

        this.off = function(eventName, optEventHandler)
        {
            if (!this.hasRegistered(eventName))
                return false;

            let handlerArray = this._eventHandlers[eventName];           

            if (!optEventHandler)
            {
                this._eventHandlers[eventName] = [];
                return true;
            }

            for (let i = 0; i < handlerArray.length; i++)
            {
                if (handlerArray[i] === optEventHandler)
                {
                    handlerArray.splice(i, 1);
                }
            }

            return true;
        };

        this.offExcept = function(eventName, eventHandler)
        {
            if (!this.hasRegistered(eventName))
                return false;

            let handlerArray = this._eventHandlers[eventName];         

            for (let i = 0; i < handlerArray.length; i++)
            {
                if (handlerArray[i] !== eventHandler)
                {
                    handlerArray.splice(i, 1);
                }
            }

            return true;
        };

        this.call = function(eventName /*optional arguments*/ )
        {
            if (!this.hasRegistered(eventName))
                return;

            let parameters = [].slice.call(arguments); //TODO spread parameter ...callbacks
            parameters.shift();

            //slice an array to prevent array conflict when using off method inside the handler to remove the handler itself
            this._eventHandlers[eventName].slice().forEach(function(eventHandler)
            {               
                eventHandler.apply(this, parameters);
            });
        };

        this.hasRegistered = function(eventName)
        {
            if (this._eventHandlers[eventName])
                return true;

            return false;
        };

        this.clear = function ()
        {
            this._eventHandlers = {};
        };
    };

    /*abstract class*/
    this.Filterify = function()
    {
        this._filter = {};

        this.set = function(filter)
        {
            let oldFilter = this._filter;
            this._filter = filter;
            this.event.call("change", filter, oldFilter);
        };

        this.setProperty = function(propertyName, value)
        {
            let oldFilter = this._filter;

            if (value === null)
                delete this._filter[propertyName];
            else
                this._filter[propertyName] = value;
            this.event.call("change", this._filter, oldFilter);
        };

        this.get = function()
        {
            return this._filter;
        };

        this.getProperty = function(propertyName)
        {
            if (!this._filter)
                return null;

            if (this._filter[propertyName] !== undefined)
                return this._filter[propertyName];

            return null;
        };

        this.isSet = function()
        {
            return Object.keys(this._filter).length > 0;
        }
    };

    this.socket = class
    {       
        constructor(url, onmessageCB)
        {  
            wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

            let _url = url;   
            let _socket = {};

            this.READY_STATE_VALUES = {
                CONNECTING: 0,
                OPEN: 1,
                CLOSING: 2,
                CLOSED: 3
            }

            this.connect = () =>
            {
                _socket = new WebSocket(url);

                _socket.onopen = () =>
                {
                    console.log("Socket is opened");
                };

                _socket.onmessage = (messageEvent) => 
                {              
                    const message = JSON.parse(messageEvent.data);
                                    
                    this.event.call("message", message); 
                    
                    if(onmessageCB !== undefined)
                    {
                        onmessageCB(messageEvent.data, messageEvent);
                    }
                };                                
            };

            this.disconnect = function ()
            {
                _socket.close();
            };

            this.sendMessage = (message) =>
            {

                if (_socket.readyState === 1)
                {
                    _socket.send(JSON.stringify(message));
                    return true;
                }

                return false;
            };           

            this.getUrl = function ()
            {
                return url;
            };

            this.setUrl = function (url)
            {
                _url = url;

                this.disconnect();
                this.connect();
            };

            this.getMessages = () => 
            {
                return _messages;
            };
            
            this.getState = () => {
                return _socket.readyState;
            }
        }
    }
};

wertyz.helper = new function()
{
    this.dom = new function()
    {
        this.createImageFromBase64$ = function(base64, options)
        {
            let $img = $("<img>",
            {
                src: "data:image/png;base64," + base64
            });

            if (options && options.resizable)
            {
                $img.click(function()
                {
                    let $this = $(this);

                    if ($this.attr("data-size") === "large")
                    {
                        $this.width("");
                        $this.removeAttr("data-size");
                    }
                    else
                    {
                        $this.width($this.width() * 3);
                        $this.attr("data-size", "large");
                    }
                });
            }

            return $img;
        };

        this.copyToClipboard = function(value)
        {
            let $body = $("body");
            let $temp = $("<input>")
                .val(value)
                .css("position", "fixed")
                .css("top", "-9999px")
                .css("opacity", "0")
                .appendTo($body);

            $temp.select();
            document.execCommand("copy");
            document.getSelection().removeAllRanges();
            $temp.remove();
        };

        this.setMaxHeightFromOffset = function(elementId)
        {
            let $element = $("#" + elementId);
            let documentHeight = $(document).height();
            let topOffset = $element.offset().top;
            let mapHeight = documentHeight - topOffset;

            //console.log(documentHeight, topOffset, mapHeight);

            $element.css("max-height", mapHeight + "px");
        };
    };

    this.inherit = function(childCtor, parentCtor)
    {
        childCtor.prototype = Object.create(parentCtor.prototype);
        childCtor.prototype.constructor = childCtor;
    };

    this.assignFunctionToObject = function(targetObject, sourceFunction)
    {
        Object.assign(targetObject, new sourceFunction());
    };

    this.removeDiacritic = function(value)
    {
        // Some unicode characters are not normalized
        value = value.replace("ł", "l"); //Polish
        value = value.replace("Ł", "L"); //Polish
        value = value.normalize('NFKD').replace(/[^\w\s.-_\/]/g, '');

        return value;
    };

    this.isNumber = function(value)
    {
        return value !== null && !isNaN(value);
    };

    this.toFixedFloat = function(number, decimalPoints)
    {
        let operand = Math.pow(10, decimalPoints);

        return Math.round(number * operand) / operand;
    };

    this.numberToHHMMSS = function(secondsValue, padLeftZeroes)
    {
        let absValue = Math.abs(secondsValue);
        let sign = absValue === secondsValue ? "" : "-";

        let hours = Math.floor(absValue / 3600);
        let minutes = Math.floor((absValue - (hours * 3600)) / 60);
        let seconds = absValue - (hours * 3600) - (minutes * 60);

        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;

        if (padLeftZeroes && hours === "00")
            return sign + minutes + ':' + seconds;

        return sign + hours + ':' + minutes + ':' + seconds;
    };

	this.numberToDaytimeHHMM = function(secondsFromMidnight)
    {       
        let hours = Math.floor(secondsFromMidnight / 3600);
        let minutes = Math.floor((secondsFromMidnight - (hours * 3600)) / 60);       

        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;      

        return hours + ':' + minutes;
    };

	this.dateTimeToHHMM = function(dateTime)
    {
        let hours = dateTime.getHours();
        let minutes = dateTime.getMinutes();

        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;

        return hours + ':' + minutes;
    };

    this.getTimeParts = function(valueInSeconds)
    {
        let hours = Math.floor(valueInSeconds / 3600);
        let minutes = Math.floor((valueInSeconds - (hours * 3600)) / 60);
        let seconds = valueInSeconds - (hours * 3600) - (minutes * 60);

        let timeParts = {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };

        return timeParts;
    };

    this.addLeadingZeroes = function(timePart)
    {
        if (timePart < 10)
            timePart = "0" + timePart;

        return timePart.toString();
    }    

    this.getDateFromShiftedUTCString = function(dateString)
    {
        let date = new Date(dateString);
        date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        return date;
    };

    this.getCurrentUnixEpoch = function()
    {
        let date = new Date();
        return date.getTime();
    };

    this.stopwatch = {};
    this.stopwatch._startTime = null;
    this.stopwatch.start = function()
    {
        wertyz.helper.stopwatch._startTime = new Date();
    };

    this.stopwatch.elapsed = function ()
    {
        const now = new Date();
        return now.getTime() - wertyz.helper.stopwatch._startTime.getTime();
    };

    this.jsonCamelCaseReviver = function(key, value)
    {
        if (value && typeof value === 'object')
        {
            for (let k in value)
            {
                if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k))
                {
                    value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                    delete value[k];
                }
            }
        }

        return value;
    };

    /* Resolves the value of object nested property given the path to the nested property.*/
    /* The property names in path must be delimited by single dot character. */
    this.valueByPropertyPath = function(object, path, defaultValue)
    {
        return path
            .split('.')
            .reduce((o, p) => o ? o[p] : defaultValue, object);
    }

    /* Creates compare function based on object property or nested property path. */
    /* If path is provided, the property names in path must be delimited by single dot character. */
    /* options: sortOrder["descending", "ascending"], 
                valueFunction - apply this function on compared values */
    this.comparable = (propertyNameOrPath, options) =>
    {
        let retVal1 = -1;
        let retVal2 = 1;
        let propertyValueEvaluator;
        const split = propertyNameOrPath.split(".");

        if (options && options.sortOrder === "descending")
        {
            retVal1 = 1;
            retVal2 = -1;
        }
        
        if (split.length > 1)
        {
            propertyValueEvaluator = wertyz.helper.valueByPropertyPath;           
        }
        else
        {
            propertyValueEvaluator = (obj, propertyNameOrPath) => 
            { 
                return obj[propertyNameOrPath];
            };
        }

        if (options && options.valueFunction)
        {           
            propertyValueEvaluator = ((evaluator) => 
            { 
                return (obj, propertyNameOrPath) => options.valueFunction(evaluator(obj, propertyNameOrPath));
            })(propertyValueEvaluator);            
        }    

        return (obj1, obj2) => 
        {
            if (propertyValueEvaluator(obj1, propertyNameOrPath) < propertyValueEvaluator(obj2, propertyNameOrPath))
            {
                return retVal1;
            }
            
            if (propertyValueEvaluator(obj1, propertyNameOrPath) > propertyValueEvaluator(obj2, propertyNameOrPath))
            {
                return retVal2;
            }
            
            return 0;
        };
    };

    this.compareArrays = function(array1, array2)
    {
        let compared = {
            join: array1.filter((value1) => array2.some((value2) => value2 === value1)),
            unique1: array1.filter((value1) => !array2.some((value2) => value2 === value1)),
            unique2: array2.filter((value2) => !array1.some((value1) => value1 === value2))
        };

        return compared;
    };

    this.compareArraysByComparisonFunction = function(array1, array2, comparisonFunction)
    {
        const compared = {
            join: array1.filter((value1) => array2.some((value2) => comparisonFunction(value1, value2))),
            unique1: array1.filter((value1) => !array2.some((value2) => comparisonFunction(value1, value2))),
            unique2: array2.filter((value2) => !array1.some((value1) => comparisonFunction(value2, value1)))
        };

        return compared;
    };

    this.distinct = function(array)
    { //works only for primitive values
        let distinct = array.filter(function(value, index, self)
        {
            return self.indexOf(value) === index;
        });

        return distinct;
    };

    this.distinctBy = function(arrayOfObjects, ...propertyNames)
    {
        // const propertyValues = arrayOfObjects.map(mapObject => 
        // { 
        //     const propertyObject = {};

        //     propertyNames.forEach(propertyName => 
        //     {
        //         propertyObject[propertyName] = mapObject[propertyName];
        //     });

        //     return propertyValues;
        // });

        return arrayOfObjects.filter((object, index) =>
        {           
            return arrayOfObjects.findIndex(indexObject => propertyNames.every(
                propertyName => indexObject[propertyName] === object[propertyName])) === index;
        });       
    }

    this.filter = function(object, filterValue, attributeNames)
    {
        filterValue = filterValue.toString().toLowerCase();

        for (let i = 0; i < attributeNames.length; i++)
        {
            let attributeName = attributeNames[i];
            let attributeValue = wertyz.helper.removeDiacritic((object[attributeName] || "").toString()).toLowerCase();
            let passed = attributeValue.indexOf(filterValue) > -1;

            if (passed)
                return true;
        }

        return false;
    };

    this.filterArray = function(array, filterValue, attributeNames)
    {
        let filteredArray = [];

        filterValue = filterValue.toString().toLowerCase();

        array.forEach(object =>
        {
            for (let i = 0; i < attributeNames.length; i++)
            {
                let attributeName = attributeNames[i];
                let attributeValue = wertyz.helper.removeDiacritic((object[attributeName] || "").toString()).toLowerCase();
                let passed = attributeValue.indexOf(filterValue) > -1;

                if (passed)
                {
                    filteredArray.push(object);
                    break;
                }
            }
        });

        return filteredArray;
    };

    this.filterArrayByIndexWeight = function(array, filterValue, attributeNames)
    {
        let filteredByWeight;
        
        filterValue = filterValue.toString().toLowerCase();        

        array.forEach(object =>
        {
            for (let i = 0; i < attributeNames.length; i++)
            {
                let attributeName = attributeNames[i];
                let attributeValue = (object[attributeName] || "").toString().toLowerCase();
                let indexOf = attributeValue.indexOf(filterValue);

                if (indexOf < 0)
                {                  
                    let attributeValueRemovedDiacritic = wertyz.helper.removeDiacritic((object[attributeName] || "").toString()).toLowerCase();
                    let filterValueRemovedDiacritic = wertyz.helper.removeDiacritic(filterValue).toLowerCase();                  
                    indexOf = attributeValueRemovedDiacritic.indexOf(filterValueRemovedDiacritic);

                    if (indexOf < 0)
                        continue;
                }

                const key = indexOf.toString();

                if (!filteredByWeight)
                    filteredByWeight = {};

                if (!filteredByWeight[key])
                    filteredByWeight[key] = [];

                filteredByWeight[key].push(object);

                break;
            }
        });        

        return filteredByWeight;
    };
};

wertyz.applicationSettings = new function()
{
    this.baseSettings = new function()
    {
        this.basePath = '';

        this.setBasePath = function(basePath)
        {
            this.basePath = basePath;
        };

        this.getBasePath = function()
        {
            return this.basePath;
        };
    };

    this.localization = new function()
    {
        let self = this;
        this._keyValues = [];

        this.get = function(key)
        {
            let value = self._keyValues[key];

            if (typeof value !== "undefined")
                return value;

            return key;
        }

        this.set = function(key, value)
        {
            self._keyValues[key] = value;
        }

        this.setAll = function(keyValues)
        {
            self._keyValues = keyValues;
        }

        this.getAll = function ()
        {
            return self._keyValues;
        }
    };

    this.appgloblocalization = new function()
    {
        let self = this;
        this._keyValues = [];

        this.get = function(key)
        {
            let value = self._keyValues[key];

            if (typeof value !== "undefined")
                return value;

            return key;
        };

        this.set = function(key, value)
        {
            self._keyValues[key] = value;
        };

        this.setAll = function(keyValues)
        {
            self._keyValues = keyValues;
        };
    };
};

wertyz.modal = new function()
{
    let self = this;
    this._selector = "#map-screenshot-modal";
    this._bodySelector = "#map-screenshot-modal-body";

    this.show = function(options)
    {
        $(self._bodySelector).empty();
        $(self._selector).show();

        if (options && options.showLoader)
            return true;
    };

    this.hide = function()
    {
        $(self._selector).hide();
    };

    this.setContent = function(html)
    {
        $(self._bodySelector).html(html);
    };

    this.alarm = new function()
    {
        wertyz.helper.assignFunctionToObject(this.event = {}, wertyz.class.Eventify);

        /*list of active event listeners
         * 1.solvealarmdone
         */
    };
};

wertyz.tables = new function()
{
    let linestable;
    let vehiclestable;
    let driverstable;
    let garagestable;
    let statusestable;
    let vehiclesbystatetable;

    this.setlinestable = function(table)
    {
        this.linestable = table;
    };

    this.getlinestable = function()
    {
        return this.linestable;
    };

    this.setvehiclestable = function(table)
    {
        this.vehiclestable = table;
    };

    this.getvehiclestable = function()
    {
        return this.vehiclestable;
    };

    this.setdriverstable = function(table)
    {
        this.driverstable = table;
    };

    this.getdriverstable = function()
    {
        return this.driverstable;
    };

    this.setgaragestable = function(table)
    {
        this.garagestable = table;
    };

    this.getgaragestable = function()
    {
        return this.garagestable;
    };

    this.setstatusestable = function(table)
    {
        this.statusestable = table;
    };

    this.getstatusestable = function()
    {
        return this.statusestable;
    };

    this.setvehiclesbystatetable = function(table)
    {
        this.vehiclesbystatetable = table;
    };

    this.getvehiclesbystatetable = function()
    {
        return this.vehiclesbystatetable;
    };
};

wertyz.gps = new function()
{
    const self = this;

    this.R = 6378137.0; // Earth radius in meters
    this.COORDINATES_MULTIPLICATOR = 0.00001;

    this.toRadians = function(value)
    {
        return value * Math.PI / 180;
    };

    this.toDegrees = function(value)
    {
        return value / Math.PI * 180;
    };

    this.isPointInsideRectangle = function (point, topLeft, bottomRight) {
        const topLeftLon = topLeft[0];
        const topLeftLat = topLeft[1];

        const bottomRightLon = bottomRight[2];
        const bottomRightLat = bottomRight[3];

        const pointLon = point[0];
        const pointLat = point[1];

        return pointLat >= topLeftLat && pointLat <= bottomRightLat && pointLon >= topLeftLon && pointLon <= bottomRightLon;
    }

    this.haversineDistance = function(lat1, lng1, lat2, lng2)
    {
        let φ1 = self.toRadians(lat1),
            λ1 = self.toRadians(lng1);
        let φ2 = self.toRadians(lat2),
            λ2 = self.toRadians(lng2);
        let Δφ = φ2 - φ1;
        let Δλ = λ2 - λ1;

        let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = self.R * c;

        return d;
    };

    this.intermediatePoint = function(lat1, lng1, lat2, lng2, ratio)
    {
        let lonLat;

        //Avoid NaN result
        if (lat1 === lat2 && lng1 === lng2)
        {
            lonLat = {
                latitude: lat1,
                longitude: lng1
            };

            return lonLat;
        }

        let φ1 = self.toRadians(lat1),
            λ1 = self.toRadians(lng1);
        let φ2 = self.toRadians(lat2),
            λ2 = self.toRadians(lng2);
        let sinφ1 = Math.sin(φ1),
            cosφ1 = Math.cos(φ1),
            sinλ1 = Math.sin(λ1),
            cosλ1 = Math.cos(λ1);
        let sinφ2 = Math.sin(φ2),
            cosφ2 = Math.cos(φ2),
            sinλ2 = Math.sin(λ2),
            cosλ2 = Math.cos(λ2);

        // distance between points
        let Δφ = φ2 - φ1;
        let Δλ = λ2 - λ1;
        let a = Math
            .sin(Δφ / 2) *
            Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        let δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        let A = Math.sin((1 - ratio) * δ) / Math.sin(δ);
        let B = Math.sin(ratio * δ) / Math.sin(δ);

        let x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
        let y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
        let z = A * sinφ1 + B * sinφ2;

        let φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
        let λ3 = Math.atan2(y, x);

        lonLat = {
            latitude: self.toDegrees(φ3),
            longitude: (self.toDegrees(λ3) + 540) % 360 - 180 // normalise lon to −180..+180°
        };

        return lonLat;
    };

    this.intermediatePointOnTrack = function(points, ratio)
    {         
        ratio = Math.min(1, Math.max(0, ratio));

        const totalTrackDistance = wertyz.gps.trackDistance(points);
        const ratioTrackDistance = totalTrackDistance * ratio;
        let distance = 0;

        for (let i = 1; i < points.length; i++)
        {
            const point1 = points[i - 1];
            const point2 = points[i];
            const tmpDistance = distance;

            distance += wertyz.gps.haversineDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude);

            if (distance >= ratioTrackDistance)
            {
                const subRatio = (ratioTrackDistance - tmpDistance) / (distance - tmpDistance);

                return wertyz.gps.intermediatePoint(
                    point1.latitude, 
                    point1.longitude, 
                    point2.latitude, 
                    point2.longitude, 
                    subRatio);
            }
        }        
    };

    this.offsetCoordinates = function(lon, lat, distance, bearing)
    {
        let lon1 = self.toRadians(lon);
        let lat1 = self.toRadians(lat);
        let dByR = distance / self.R;

        lon = lon1 +
            Math.atan2(
                Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
                Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));

        lat = Math.asin(
            Math.sin(lat1) * Math.cos(dByR) +
            Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));

        let lonLat = [self.toDegrees(lon), self.toDegrees(lat)];

        return lonLat;
    };

    this.trackDistance = function(points)
    {
         let distance = 0;

         for (let i = 1; i < points.length; i++)
         {
            distance += wertyz.gps.haversineDistance(points[i].latitude, points[i].longitude,
               points[i - 1].latitude, points[i - 1].longitude);
         }

         return distance;
    };

    /*
     * Returns (signed) distance from certain point to great circle defined by start-point and end-point.             
     */
    this.crossTrackDistance = function(lat, lng, lat1, lng1, lat2, lng2)
    {
        let δ13 = self.haversineDistance(lat1, lng1, lat, lng) / self.R;
        let θ13 = self.toRadians(self.bearing(lat1, lng1, lat, lng));
        let θ12 = self.toRadians(self.bearing(lat1, lng1, lat2, lng2));
        let δxt = Math.asin(Math.sin(δ13) * Math.sin(θ13 - θ12));

        return δxt * self.R;
    };

    /*
     * Returns how far certain point is along a path from start-point, heading towards end-point.
     * That is, if a perpendicular is drawn from certain point to the (great circle) path, the along-track
     * distance is the distance from the start point to where the perpendicular crosses the path.     
     */
    this.alongTrackDistance = function(lat, lng, lat1, lng1, lat2, lng2)
    {
        let δ13 = self.haversineDistance(lat1, lng1, lat, lng) / self.R;
        let θ13 = self.toRadians(self.bearing(lat1, lng1, lat, lng));
        let θ12 = self.toRadians(self.bearing(lat1, lng1, lat2, lng2));
        let δxt = Math.asin(Math.sin(δ13) * Math.sin(θ13 - θ12));
        let δat = Math.acos(Math.cos(δ13) / Math.abs(Math.cos(δxt)));

        return δat * Math.sign(Math.cos(θ12 - θ13)) * self.R;
    };

    this.closestDistanceToPath = function(lat, lng, lat1, lng1, lat2, lng2)
    {
        let distance;
        const crossTrackDistance = self.crossTrackDistance(lat, lng, lat1, lng1, lat2, lng2);
        const alongTrackDistance = self.alongTrackDistance(lat, lng, lat1, lng1, lat2, lng2);
        const pathDistance = self.haversineDistance(lat1, lng1, lat2, lng2);

        if (alongTrackDistance > 0 && alongTrackDistance < pathDistance)
        {
            distance = Math.abs(crossTrackDistance)
        }
        else if (alongTrackDistance >= pathDistance)
        {
            distance = wertyz.gps.haversineDistance(lat, lng, lat2, lng2);
        }
        else
        {
            distance = wertyz.gps.haversineDistance(lat, lng, lat1, lng1);
        }

        return distance;
    };

    this.closestPointOnPath = function(lat, lng, lat1, lng1, lat2, lng2)
    {     
        const alongTrackDistance = self.alongTrackDistance(lat, lng, lat1, lng1, lat2, lng2);
        const pathDistance = self.haversineDistance(lat1, lng1, lat2, lng2);        
        
        if (alongTrackDistance <= 0)
        {
            return { latitude: lat1, longitude: lng1 };
        }

        if (alongTrackDistance >= pathDistance)
        {
            return { latitude: lat2, longitude: lng2 };
        }

        return wertyz.gps.intermediatePoint(lat1, lng1, lat2, lng2, pathDistance / alongTrackDistance);
    };

    /*
     * Returns the (initial) bearing from certain point to destination point.
     */
    this.bearing = function(lat1, lng1, lat2, lng2)
    {
        let φ1 = self.toRadians(lat1);
        let φ2 = self.toRadians(lat2);
        let Δλ = self.toRadians(lng2 - lng1);
        let y = Math.sin(Δλ) * Math.cos(φ2);
        let x = Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        let θ = Math.atan2(y, x);

        return (self.toDegrees(θ) + 360) % 360;
    };

    this.parseDecimalCoordinates = function(value)
    {
        value = value.trim();

        //valid values: integer numbers and float values with "." or "," decimal separator
        //valid latitude\longitude delimiter: "," or ";" or space with any length
        let regex = /^-?[0-9]{1,3}([\.,\,][0-9]+)?\s*[\,,;,\s]\s*-?[0-9]{1,3}([\.,\,][0-9]+)?$/;

        if (regex.test(value))
        {

            //latitude
            regex = /^-?[0-9]{1,3}([\.,\,][0-9]+)?\s*[\,,;,\s]/;
            let latPart = regex.exec(value)[0].trim().replace(/\s*[\,,;,\s]$/, "").replace(",", ".");
            let lat = parseFloat(latPart);

            //remove latitude part except delimiter
            value = value.replace(/^-?[0-9]{1,3}([\.,\,][0-9]+)?/, "");

            //longitude
            regex = /[\,,;,\s]\s*-?[0-9]{1,3}([\.,\,][0-9]+)?$/;
            let lngPart = regex.exec(value)[0].trim().replace(/^[\,,;,\s]\s*/, "").replace(",", ".");
            let lng = parseFloat(lngPart);

            return [lat, lng];
        }

        return null;
    };

    this.convertDmsToDecimal = function(degrees, minutes, seconds, direction)
    {
        let coordinate = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

        // Don't do anything for N or E
        if (direction === "S" || direction === "W")
            coordinate = coordinate * -1;

        return coordinate;
    };

    this.parseDmsToDecimal = function(value)
    {
        let parts = value.split(/[^\d\w\.]+/);
        let coordinate = wertyz.gps.convertDmsToDecimal(parts[0], parts[1], parts[2], parts[3]);

        return coordinate;
    };

    /* 
     * Smallest enclosing circle - Library (JavaScript)
     * 
     * Copyright (c) 2017 Project Nayuki
     * https://www.nayuki.io/page/smallest-enclosing-circle
     * 
     * This program is free software: you can redistribute it and/or modify
     * it under the terms of the GNU Lesser General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     * 
     * This program is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU Lesser General Public License for more details.
     * 
     * You should have received a copy of the GNU Lesser General Public License
     * along with this program (see COPYING.txt and COPYING.LESSER.txt).
     * If not, see <http://www.gnu.org/licenses/>.
     */
    this.smallestEnclosingCircle = new function()
    {
        let self = this;
        let multiplicativeEpsilon = 1 + 1e-14;

        /* 
         * Returns the smallest circle that encloses all the given points. Runs in expected O(n) time, randomized.
         * Input: A list of points, where each point is an object {x: float, y: float}, e.g. [{x:0,y:5}, {x:3.1,y:-2.7}].
         * Output: A circle object of the form {x: float, y: float, r: float}.
         * Note: If 0 points are given, null is returned. If 1 point is given, a circle of radius 0 is returned.
         */
        // Initially: No boundary points known
        this.makeCircle = function(points)
        {
            // Clone list to preserve the caller's data, do Durstenfeld shuffle
            let shuffled = points.slice();
            for (let i = points.length - 1; i >= 0; i--)
            {
                let j = Math.floor(Math.random() * (i + 1));
                j = Math.max(Math.min(j, i), 0);
                let temp = shuffled[i];
                shuffled[i] = shuffled[j];
                shuffled[j] = temp;
            }

            // Progressively add points to circle or recompute circle
            let c = null;
            for (let i = 0; i < shuffled.length; i++)
            {
                let p = shuffled[i];
                if (c == null || !self.isInCircle(c, p))
                    c = self.makeCircleOnePoint(shuffled.slice(0, i + 1), p);
            }
            return c;
        }

        // One boundary point known
        this.makeCircleOnePoint = function(points, p)
        {
            let c = {
                x: p.x,
                y: p.y,
                r: 0
            };
            for (let i = 0; i < points.length; i++)
            {
                let q = points[i];
                if (!self.isInCircle(c, q))
                {
                    if (c.r == 0)
                        c = self.makeDiameter(p, q);
                    else
                        c = self.makeCircleTwoPoints(points.slice(0, i + 1), p, q);
                }
            }
            return c;
        }

        // Two boundary points known
        this.makeCircleTwoPoints = function(points, p, q)
        {
            let circ = self.makeDiameter(p, q);
            let left = null;
            let right = null;

            // For each point not in the two-point circle
            points.forEach(function(r)
            {
                if (self.isInCircle(circ, r))
                    return;

                // Form a circumcircle and classify it on left or right side
                let cross = self.crossProduct(p.x, p.y, q.x, q.y, r.x, r.y);
                let c = self.makeCircumcircle(p, q, r);
                if (c == null)
                    return;
                else if (cross > 0 && (left == null || self.crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) > self.crossProduct(p.x, p.y, q.x, q.y, left.x, left.y)))
                    left = c;
                else if (cross < 0 && (right == null || self.crossProduct(p.x, p.y, q.x, q.y, c.x, c.y) < self.crossProduct(p.x, p.y, q.x, q.y, right.x, right.y)))
                    right = c;
            });

            // Select which circle to return
            if (left == null && right == null)
                return circ;
            else if (left == null)
                return right;
            else if (right == null)
                return left;
            else
                return left.r <= right.r ? left : right;
        }

        this.makeCircumcircle = function(p0, p1, p2)
        {
            // Mathematical algorithm from Wikipedia: Circumscribed circle
            let ax = p0.x,
                ay = p0.y;
            let bx = p1.x,
                by = p1.y;
            let cx = p2.x,
                cy = p2.y;
            let ox = (Math.min(ax, bx, cx) + Math.max(ax, bx, cx)) / 2;
            let oy = (Math.min(ay, by, cy) + Math.max(ay, by, cy)) / 2;
            ax -= ox;
            ay -= oy;
            bx -= ox;
            by -= oy;
            cx -= ox;
            cy -= oy;
            let d = (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) * 2;
            if (d == 0)
                return null;
            let x = ox + ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
            let y = oy + ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
            let ra = self.distance(x, y, p0.x, p0.y);
            let rb = self.distance(x, y, p1.x, p1.y);
            let rc = self.distance(x, y, p2.x, p2.y);
            return {
                x: x,
                y: y,
                r: Math.max(ra, rb, rc)
            };
        }

        this.makeDiameter = function(p0, p1)
        {
            let x = (p0.x + p1.x) / 2;
            let y = (p0.y + p1.y) / 2;
            let r0 = self.distance(x, y, p0.x, p0.y);
            let r1 = self.distance(x, y, p1.x, p1.y);
            return {
                x: x,
                y: y,
                r: Math.max(r0, r1)
            };
        }

        /* Simple mathematical functions */

        this.isInCircle = function(c, p)
        {
            return c != null && self.distance(p.x, p.y, c.x, c.y) <= c.r * multiplicativeEpsilon;
        }

        // Returns twice the signed area of the triangle defined by (x0, y0), (x1, y1), (x2, y2).
        this.crossProduct = function(x0, y0, x1, y1, x2, y2)
        {
            return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
        }

        this.distance = function(x0, y0, x1, y1)
        {
            return Math.hypot(x0 - x1, y0 - y1);
        }
    }
};

wertyz.vehicle = new function()
{
    this.popup = new function()
    {
        this.getHtmlDataTable$ = function(vehicle)
        {
            let locale = wertyz.applicationSettings.localization.get;
            let $table = $("<table></table>");
            let arrow = "&nbsp;&nbsp;\u2192&nbsp;&nbsp;";

            $table.append("<tr class='noimportant'><td><span class='description'>" +
                locale("infobox.licence") + " - " +
                locale("infobox.vin") + " - " +
                locale("infobox.obu") + ": </span><td>" +
                (vehicle.licence || "") + (vehicle.vin ? " - " + vehicle.vin : "") + (vehicle.obu ? " - " + vehicle.obu : "") +
                "</td></tr>");

            $table.append("<tr><td><span class='description'>" + locale("infobox.communication") + ": </span><td>" +
                (vehicle.lastCommunication ? wertyz.helper.getDateFromShiftedUTCString(vehicle.lastCommunication).toLocaleString() : "") + "</td></tr>");
            $table.append("<tr><td><span class='description'>" + locale("infobox.driver") + ": </span><td>" +
                (vehicle.driverNumber || "") + (vehicle.driverName ? (" - " + vehicle.driverName) : "") + "</td></tr>");

            $table.append("<tr class='noimportant'><td><span class='description'>" +
                locale("infobox.order") + arrow +
                locale("infobox.line") + arrow +
                locale("infobox.trip") + ": </span><td>" +
                (vehicle.order || "") +
                (vehicle.line ? arrow + vehicle.line : "") +
                (vehicle.trip ? arrow + vehicle.trip : "") +
                "</td></tr>");
            $table.append("<tr class='noimportant'><td><span class='description'>" + locale("infobox.tripdate") + ": </span><td>" +
                (vehicle.tripDate ? wertyz.helper.getDateFromShiftedUTCString(vehicle.tripDate).toLocaleString() : "") + "</td></tr>");
            $table.append("<tr class='noimportant'><td><span class='description'>" + locale("infobox.route") + ": </span><td>" +
                (vehicle.routeNumber || "") + "</td></tr>");
            $table.append("<tr class='noimportant'><td><span class='description'>" +
                locale("infobox.position") + ": </span><td>" +
                vehicle.latitude + ", " + vehicle.longitude +
                (wertyz.helper.isNumber(vehicle.altitude) ? (", " + vehicle.altitude + " m") : "") + "</td></tr>");

            //$table.append("<tr class='noimportant'><td><span class='description'>" + locale("infobox.passengers") + ": </span><td>" +
            //   (vehicle.passenger || "") + "</td></tr>");
            $table.append("<tr class='noimportant'><td><span class='description'>" + locale("infobox.passengers") + ": </span><td>" +
                (wertyz.helper.isNumber(vehicle.passengerCapacityUsage) ? (vehicle.passengerCapacityUsage + " %") : "") + "</td></tr>");
            $table.append("<tr><td><span class='description'>" + locale("infobox.delay") + ": </span><td>" +
                (wertyz.helper.isNumber(vehicle.delay) ? (wertyz.helper.numberToHHMMSS(vehicle.delay)) : "") + "</td></tr>");
            $table.append("<tr class='noimportant'><td><span class='description'>" + locale("infobox.deviation") + ": </span><td>" +
                (wertyz.helper.isNumber(vehicle.deviationGps) ? (vehicle.deviationGps + " m") : "") + "</td></tr>");

            $table.append("<tr class='noimportant'><td><span class='description'>" +
                locale("infobox.speed") + arrow +
                locale("infobox.azimuth") + ": </span><td>" +
                (wertyz.helper.isNumber(vehicle.speed) ? (Math.round(vehicle.speed) + " km/h") : "") +
                (wertyz.helper.isNumber(vehicle.azimuth) ? (arrow + vehicle.azimuth + " °") : "") + "</td></tr>");

            return $table;
        }
    };

    this.axGet = function(options)
    {
        let obus = options ?
            JSON.stringify(options.obus) :
            null;

        //TEST
        // options.done({data: JSON.stringify(wertyz.line.data.vehicles)});
        //return;

        $.ajax(
            {
                type: "POST",
                url: options.url,
                data:
                {
                    obus: obus
                }
            })
            .done(function(data, textStatus, jqXhr)
            {
                if (options && options.done)
                    options.done(data, textStatus, jqXhr);
            })
            .fail(function(data, textStatus, error)
            {
                if (options && options.fail)
                    options.fail(data, textStatus, error);
            })
            .always(function()
            {
                if (options && options.always)
                    options.always();
            });
    };
};

wertyz.point = new function()
{
    this.PointType = {
        POINT: 0,
        STOPID: 1,
        GLOBALSTOPID: 2,
        STOPNAME: 3,
        STOPNAME2: 4,
        CUSTOMPLATFORMNAME: 5,
        STOPNAMEINFOTABLE: 6,
        CROSSENTRY: 10,
        CROSSEXIT: 11,
        CROSSENTRYBUSSTOP: 12,
        CROSSID: 13,
        CROSSNAME: 14,
        CROSSIP: 15,
        CROSSPORT: 16,
        CROSSARM: 17,
        INFOTABLE: 18,
        SPEEDLIMITSTART: 27,
        SPEEDLIMITSTOP: 28
    };

    this.createListTypeArray = function(point)
    {
        let listTypeValues = new wertyz.point.ListTypeArray();

        point.listTypeValues.forEach(function(listTypeValue)
        {
            listTypeValues.push(
            {
                listTypeId: listTypeValue.listTypeId,
                value: listTypeValue.value,
                valueId: listTypeValue.valueId
            });
        });

        return listTypeValues;
    };

    this.createAdditionalListTypeArray = function(point)
    {
        let listTypeAdditionalValues = new wertyz.point.ListTypeArray();

        if (point.listTypeAdditionalValues)
        {
            point.listTypeAdditionalValues.forEach(function(listTypeAdditionalValue)
            {
                let value = {
                    listTypeId: listTypeAdditionalValue.listTypeId
                };

                if (listTypeAdditionalValue.listTypeId === wertyz.point.PointType.INFOTABLE)
                {
                    value.stateColor = listTypeAdditionalValue.stateColor;
                }

                listTypeAdditionalValues.push(value);
            });
        }

        return listTypeAdditionalValues;
    };

    this.ListTypeArray = function()
    {
        let self = this;
        this._array = [];

        this.setArray = function(array)
        {
            self._array = array;
        }

        this.getArray = function()
        {
            return self._array;
        };

        this.push = function(object)
        {
            return self._array.push(object);
        };

        this.indexOf = function(object)
        {
            return self._array.indexOf(object);
        };

        this.splice = function(start, deleteCount)
        {
            return self._array.splice(start, deleteCount);
        };

        this.find = function(callback)
        {
            return self._array.find(callback);
        };

        this.forEach = function(callback)
        {
            for (let i = 0, l = self._array.length; i < l; i++)
            {
                callback(self._array[i], i, self._array);
            }
        };

        this.getLength = function()
        {
            return self._array.length;
        };

        this.getAt = function(index)
        {
            return self._array[index];
        };

        this.setAt = function(index, value)
        {
            self._array[index] = value;
        };

        this.getType = function(listTypeId)
        {
            return self._array.find(function(ltv)
            {
                return ltv.listTypeId === listTypeId;
            });
        };

        this.containsType = function(listTypeId)
        {
            return self._array.some(function(ltv)
            {
                return ltv.listTypeId === listTypeId
            });
        };

        this.getTypeValue = function(listTypeId)
        {
            let type = self._array.find(function(ltv)
            {
                return ltv.listTypeId === listTypeId
            });

            if (type)
                return type.value;
            return;
        };
    };
};

wertyz.route = new function()
{
    this.computing = new function()
    {
        this.getRouteDistance = function(route)
        {
            return route.points[route.points.length - 1].distanceOnRoute;
        };

        this.getRouteTime = function(route)
        {
            return route.points[route.points.length - 1].timeOnRoute;
        };

        this.computeDerivedValues = function(routes)
        {
            routes.forEach(function(route)
            {
                let tmpSegmentId;
                let tmpDistance = 0;
                let tmpTime = 0;
                let orderOnRoute = 0;
                let orderOnSegment;
                let lastPoint;

                route.points.forEach(function(segmentPoint)
                {
                    let segmentId = segmentPoint.segmentId;

                    if (segmentId !== tmpSegmentId)
                    {
                        tmpSegmentId = segmentId;

                        if (lastPoint)
                        {
                            orderOnSegment = 2;
                            tmpDistance = lastPoint.distanceOnRoute;
                            tmpTime = lastPoint.timeOnRoute;
                        }
                        else
                        {
                            orderOnSegment = 1;
                        }
                    }

                    segmentPoint.orderOnRoute = ++orderOnRoute;
                    segmentPoint.orderOnSegment = orderOnSegment++;
                    segmentPoint.distanceOnRoute = tmpDistance + segmentPoint.distanceOnSegment;
                    segmentPoint.timeOnRoute = tmpTime + segmentPoint.timeOnSegment;
                    lastPoint = segmentPoint;
                });
            });
        };

        this.assignTripPointsToSegments = function(stopSegmentPoints, points)
        {
            let segments = [];

            for (let i = 0; i < points.length; i++)
            {
                let point = points[i];

                if (point.segmentPointId)
                {
                    let stopIndex = stopSegmentPoints.findIndex(function(ssp)
                    {
                        return ssp.segmentPointId === point.segmentPointId;
                    });

                    segment = {
                        //last stop can not have points => (stopIndex + 1) logically must exist
                        segmentId: stopSegmentPoints[stopIndex + 1].segmentId,
                        points: []
                    };

                    segments.push(segment);
                }

                if (!segment)
                    continue;

                segment.points.push(point);
            }

            return segments;
        };

        this.assignPointsToSegments = function(stopSegmentPoints, points)
        {
            let stopPointer = 1;
            let lastPoint = stopSegmentPoints[0].point;
            let segments = [];
            let segment = {
                segmentId: stopSegmentPoints[0].segmentId,
                //firstSegmentPointId: stopSegmentPoints[0].segmentPointId,
                points: []
            };

            segments.push(segment);

            for (let i = 0; i < points.length; i++)
            {
                let point = {
                    latitude: points[i].latitude,
                    longitude: points[i].longitude,
                };
                let lastSegmentDistance;
                let lastCrossTrackDistance;
                let lastAlongTrackDistance;

                for (let j = stopPointer; j < stopPointer + 2 && j < stopSegmentPoints.length && stopPointer < stopSegmentPoints.length - 1; j++)
                { //Searching only in two consecutive segments  
                    let fromPoint = j === stopPointer ?
                        lastPoint :
                        stopSegmentPoints[j - 1].point;
                    let toPoint = stopSegmentPoints[j].point;
                    let segmentDistance = wertyz.gps.haversineDistance(
                        fromPoint.latitude,
                        fromPoint.longitude,
                        toPoint.latitude,
                        toPoint.longitude);
                    let crossTrackDistance = wertyz.gps.crossTrackDistance(
                        point.latitude,
                        point.longitude,
                        fromPoint.latitude,
                        fromPoint.longitude,
                        toPoint.latitude,
                        toPoint.longitude);
                    let alongTrackDistance = wertyz.gps.alongTrackDistance(
                        point.latitude,
                        point.longitude,
                        fromPoint.latitude,
                        fromPoint.longitude,
                        toPoint.latitude,
                        toPoint.longitude);

                    if (j === stopPointer)
                    {
                        //if (i === 0)
                        //{//First point belonging to first segment must be reasonably accurate
                        //   if (Math.abs(crossTrackDistance) > 50)
                        //      break;
                        //   if (alongTrackDistance < -50 || alongTrackDistance > segmentDistance)
                        //      break;
                        //}

                        lastSegmentDistance = segmentDistance;
                        lastCrossTrackDistance = crossTrackDistance;
                        lastAlongTrackDistance = alongTrackDistance;
                        continue;
                    }

                    let afinityToSegment = wertyz.route.computing.decideAffinityToSegment(
                        lastSegmentDistance,
                        lastCrossTrackDistance,
                        lastAlongTrackDistance,
                        segmentDistance,
                        crossTrackDistance,
                        alongTrackDistance);

                    //console.log(i + 1, afinityToSegment, lastCrossTrackDistance, crossTrackDistance, lastAlongTrackDistance, alongTrackDistance);
                    //console.log(i + 1, j, stopPointer, afinityToSegment);

                    if (afinityToSegment === 2)
                    { //create next segment        
                        segment = {
                            segmentId: stopSegmentPoints[stopPointer].segmentId,
                            //firstSegmentPointId: stopSegmentPoints[stopPointer].segmentPointId,
                            points: []
                        };
                        segments.push(segment);
                        stopPointer++;
                        break;
                    }
                }

                segment.points.push(point);
                lastPoint = point;
            }

            //console.log(segments);
            return segments;
        };

        this.decideAffinityToSegment = function(segmentDistance1, crossTrackDistance1, alongTrackDistance1, segmentDistance2, crossTrackDistance2, alongTrackDistance2)
        {
            let isInSegmentProjection1 = alongTrackDistance1 >= 0 && alongTrackDistance1 <= segmentDistance1;
            let isInSegmentProjection2 = alongTrackDistance2 >= 0 && alongTrackDistance2 <= segmentDistance2;
            let isAffinityToSegment1 = false;

            if (isInSegmentProjection1 && isInSegmentProjection2)
                isAffinityToSegment1 = Math.abs(crossTrackDistance1) <= Math.abs(crossTrackDistance2);
            else if (!isInSegmentProjection1 && !isInSegmentProjection2)
                isAffinityToSegment1 = (alongTrackDistance1 <= segmentDistance1) || (alongTrackDistance1 - segmentDistance1 <= Math.abs(alongTrackDistance2));
            else
                isAffinityToSegment1 = isInSegmentProjection1;

            let affinity = !isAffinityToSegment1 + 1;

            return affinity; // 1 | 2
        };
    };

    this.axGet = function(options)
    {
        let routeNumbers = options ?
            JSON.stringify(options.routeNumbers) :
            null;

        //TEST
        // options.done({data: JSON.stringify(wertyz.line.data.routes)});
        // return;

        $.ajax(
            {
                type: "POST",
                url: options.url,
                data:
                {
                    routeNumbers: routeNumbers
                }
            })
            .done(function(data, textStatus, jqXhr)
            {
                if (options && options.done)
                    options.done(data, textStatus, jqXhr);
            })
            .fail(function(data, textStatus, error)
            {
                if (options && options.fail)
                    options.fail(data, textStatus, error);
            })
            .always(function()
            {
                if (options && options.always)
                    options.always();
            });
    };
};

wertyz.common = new function()
{
    this.json = new function()
    {
        this.lines = new function()
        {
            this.vehiclePropertyMapping = {
                obu: "o",
                vin: "b",
                licence: "li",
                lastCommunication: "lbs", //l
                driverName: "dr",
                order: "du",
                line: "ln",
                trip: "tn",
                latitude: "la",
                longitude: "lo",
                passengerCount: "np",
                delay: "d",
                deviation: "de",
                speed: "s",
                azimuth: "az"
            };
        };

        this.vehicle = new function()
        {
            this.vehiclePropertyMapping = {
                obu: "o",
                vin: "b",
                licence: "li",
                lastCommunication: "lbs", //l
                driverName: "dr",
                driverNumber: "dn",
                order: "du",
                line: "ln",
                trip: "tn",
                latitude: "la",
                longitude: "lo",
                passengerCount: "np",
                delay: "d",
                deviation: "de",
                speed: "s",
                azimuth: "az"
            };

            this.getStrongVehicle = function(jsonObject, optPropertyMapping)
            {
                if (!optPropertyMapping)
                    return jsonObject;

                let vehicle = new Object()
                {
                    this.obu = jsonObject[optPropertyMapping.obu];
                    this.vin = jsonObject[optPropertyMapping.vin];
                    this.licence = jsonObject[optPropertyMapping.licence];
                    this.lastCommunication = jsonObject[optPropertyMapping.lastCommunication];
                    this.driverName = jsonObject[optPropertyMapping.driverName];
                    this.driverNumber = jsonObject[optPropertyMapping.driverNumber];
                    this.order = jsonObject[optPropertyMapping.order];
                    this.line = jsonObject[optPropertyMapping.line];
                    this.trip = jsonObject[optPropertyMapping.trip];
                    this.latitude = jsonObject[optPropertyMapping.latitude];
                    this.longitude = jsonObject[optPropertyMapping.longitude];
                    this.passengerCount = jsonObject[optPropertyMapping.passengerCount];
                    this.delay = jsonObject[optPropertyMapping.delay];
                    this.deviation = jsonObject[optPropertyMapping.deviation];
                    this.speed = jsonObject[optPropertyMapping.speed];
                    this.azimuth = jsonObject[optPropertyMapping.azimuth];
                };

                return vehicle;
            }
        }
    };
};