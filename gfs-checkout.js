import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/iron-icons/hardware-icons.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import { format, addDays } from 'date-fns';

// GFS Elements
import '@gfs/gfs-droppoint/gfs-droppoint.js';
import '@gfs/gfs-store/gfs-store.js';
import '@gfs/gfs-listbox/gfs-listbox.js';
import '@gfs/gfs-item/gfs-item.js';
import '@gfs/gfs-dropdown-menu/gfs-dropdown-menu.js';
import '@gfs/gfs-toast/gfs-toast.js';
import './gfs-checkout-style.js';

import '../../mp-calendar/mp-calendar.js';

export class GfsCheckout extends PolymerElement {
    static get template() {
        return html`
            <style include="gfs-checkout-style mp-calendar-theme"></style>

            <iron-ajax id="createSession"
                    method="POST" handle-as="json"
                    content-type="application/json"
                    on-response="_handleSessionResponse"
                    on-error="_handleError"
                    timeout="10000">
            </iron-ajax>

            <iron-ajax id="checkoutOptions"
                    method="GET" handle-as="json"
                    content-type="application/json"
                    on-response="_handleCheckoutOptionsResponse"
                    on-error="_handleError"
                    timeout="10000">
            </iron-ajax>

            <iron-ajax id="checkoutDayDefinite"
                    method="GET" handle-as="json"
                    content-type="application/json"
                    on-response="_handleCheckoutDayDefiniteResponse"
                    on-error="_handleError"
                    timeout="10000">
            </iron-ajax>

            <iron-ajax id="getAvailableServices"
                    method="GET" handle-as="json"
                    content-type="application/json"
                    on-response="_handleAvailableServicesResponse"
                    on-error="_handleError"
                    timeout="10000">
            </iron-ajax>

            <div id="loader">
                <paper-spinner active></paper-spinner>
            </div>

            <div id="gfsDeliveryOptionTabs">
                <div class$="paper-tabs {{orientation}}">
                    <vaadin-tabs selected="{{defaultDeliveryMethod}}" orientation="{{orientation}}" theme="equal-width-tabs">
                        <dom-if if="{{useStandard}}">
                            <template>
                                <vaadin-tab on-click="_resetSelected">
                                    <iron-icon icon="maps:local-shipping"></iron-icon>
                                    <span>{{standardDeliveryTitle}}</span>
                                </vaadin-tab>
                            </template>
                        </dom-if>

                        <dom-if if="{{useCalendar}}">
                            <template>
                                <vaadin-tab on-click="_resetSelected">
                                    <iron-icon icon="icons:event"></iron-icon>
                                    <span>{{calendarDeliveryTitle}}</span>
                                </vaadin-tab>
                            </template>
                        </dom-if>

                        <dom-if if="{{useDroppoints}}">
                            <template>
                                <vaadin-tab on-click="_resetSelected">
                                    <iron-icon icon="icons:room"></iron-icon>
                                    <span>{{dropPointDeliveryTitle}}</span>
                                </vaadin-tab>
                            </template>
                        </dom-if>
                    </vaadin-tabs>

                    <!-- content -->
                    <iron-pages selected="[[defaultDeliveryMethod]]" class="page">
                        <dom-if if="{{useStandard}}">
                            <template>
                                <div id="standarServices">
                                    <gfs-listbox att-for-selected="id" selected="[[preselectedService]]">
                                        <dom-repeat items="{{standardRates}}" sort="_sortServices">
                                            <template>
                                                <gfs-item id="[[item.select]]" on-click="updateDeliveryOptions">
                                                    [[item.description]] [[currencySymbol]][[_priceFix(item.costs.price)]] [[item.deliveryDateRange]]
                                                </gfs-item>
                                            </template>
                                        </dom-repeat>
                                    </gfs-listbox>

                                    <div class="lcc lcc-charge-standard hide">The prices shown <strong>include</strong> import Duties and Taxes of {{currencySymbol}}{{taxAndDutyPrice}}</div>
                                    <div class="lcc lcc-estimate-standard hide">
                                        The prices shown <strong>exclude</strong> import Duties and Taxes. You may be charged an additional
                                        {{currencySymbol}}{{taxAndDutyPrice}} by your local customs office
                                    </div>
                                </div>
                            </template>
                        </dom-if>

                        <dom-if if="{{useCalendar}}">
                            <template>
                                <div id="calendarWrap">
                                    <div id="calendarLoader">
                                        <paper-spinner active></paper-spinner>
                                    </div>
                                    <mp-calendar id="calendar"
                                                month-labels='[[monthLabels]]'
                                                day-labels='[[dayLabels]]'
                                                disabled-days="[[disabledDays]]"
                                                disabled-dates="[[disabledDates]]"
                                                disable-prev-days="[[disablePrevDays]]"
                                                disable-next-days="[[disableNextDays]]">
                                    </mp-calendar>

                                    <div class="calendar-info style-scope gfs-checkout">
                                        <span class="available-service style-scope gfs-checkout">Available</span>
                                        <span class="unavailable-service style-scope gfs-checkout">Unavailable</span>
                                        <span class="selected-service style-scope gfs-checkout">Selected</span>
                                    </div>

                                    <div id="deliveryPlace">
                                        <dom-if if="{{_selectedDayDeliveries}}">
                                            <template>
                                                <h4 class="grey">{{calendarDayPrompt}}</h4>
                                            </template>
                                        </dom-if>

                                        <dom-if if="{{!_selectedDayDeliveries}}">
                                            <template>
                                                <h4 class="calendarDayNonPrompt">{{calendarDayNonPrompt}}</h4>
                                            </template>
                                        </dom-if>

                                        <div id="calendarServices">
                                            <gfs-listbox att-for-selected="id" selected="[[preselectedService]]">
                                                <dom-repeat items="{{_selectedDayDeliveries}}" sort="_sortServices">
                                                    <template>
                                                        <gfs-item id="[[item.select]]" on-click="updateDeliveryOptions">
                                                            [[item.description]] [[currencySymbol]][[_priceFix(item.costs.price)]] [[item.deliveryDateRange]]
                                                        </gfs-item>
                                                    </template>
                                                </dom-repeat>
                                            </gfs-listbox>

                                            <div class="lcc lcc-charge-calendar hide">The prices shown <strong>include</strong> import Duties and Taxes of {{currencySymbol}}{{taxAndDutyPrice}}</div>
                                            <div class="lcc lcc-estimate-calendar hide">
                                                The prices shown <strong>exclude</strong> import Duties and Taxes. You may be charged an additional
                                                {{currencySymbol}}{{taxAndDutyPrice}} by your local customs office
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </dom-if>

                        <dom-if if="{{useDroppoints}}">
                            <template>
                                <div id="ddWrap">
                                    <div id="mapLoader">
                                        <paper-spinner active></paper-spinner>
                                    </div>
                                    <div id="toggleDropPointsViewControls">
                                        <div id="ddList" class="toggle-label view-list">
                                            <iron-icon icon="view-list" class="toggle"></iron-icon> List
                                        </div>

                                        <paper-toggle-button id="toggleDropPointsView" class="map-to-list" on-change="_showDropPointsView" active="true" checked></paper-toggle-button>

                                        <div id="ddMap" class="toggle-label view-map active">
                                            <iron-icon icon="maps:place" class="toggle"></iron-icon> Map
                                        </div>
                                    </div>

                                    <div id="mapContainer">
                                        <div class="search-postcode-wrap">
                                            <div class="search-wrap">
                                                <div class="search">
                                                    <input type="text" id="droppointAddress" class$="gfs-input {{useDroppointsStoresClass}}" placeholder="Find alternative postcode" />
                                                    <gfs-button name="findPostcode" id="droppointSubmit" class="default flat" disabled="[[isBtnDisabled]]" on-click="_searchPostcode">Find</gfs-button>
                                                </div>
                                                <div class="search-results">
                                                    <input type="hidden" id="homePostcodeDroppoint" value="" />
                                                    <span id="lastddPostcode"></span>
                                                </div>
                                            </div>

                                            <!-- options to show/hide droppoints or stores in the map available when useDroppointsStores is set -->
                                            <template is="dom-if" if="{{useDroppointsStores}}">
                                                <div class="userDroppointStores">
                                                    <div class="options">
                                                        <paper-toggle-button id="toggleStoreOnMap" class="droppoint-selection" on-change="_showStores" active="true"></paper-toggle-button>
                                                        <div class="toggle-droppoints-store"> <iron-icon icon="maps:store-mall-directory"></iron-icon>Show Stores </div>
                                                    </div>
                                                    <div class="options">
                                                        <paper-toggle-button id="toggleDropPointsOnMap" class="droppoint-selection" on-change="_hideDropPoints" active="true"></paper-toggle-button>
                                                        <div class="toggle-droppoints-store"><iron-icon icon="maps:pin-drop"></iron-icon>Hide DropPoints </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <div id="wrongPostoce"></div>
                                        </div>

                                        <gfs-droppoint-map id="gfsDroppointMap" checkout-token="[[checkoutToken]]" checkout-request="{{checkoutRequest}}" checkout-uri="{{checkoutUri}}" country-code="[[countryCode]]" post-code="[[postCode]]" search-result-text="[[postcodeSearchResultText]]" store-map-icon="[[storeMapIcon]]"></gfs-droppoint-map>
                                    </div>

                                    <div id="sortingDroppoint" class="hide">
                                        <gfs-dropdown-menu id="sortinglist" icon="sort" label="Sort By">
                                            <a href="#" on-click="changeDropPointSort"><iron-icon icon="maps:navigation"></iron-icon>Distance</a>
                                            <a href="#" on-click="changeDropPointSort"><iron-icon icon="maps:local-shipping"></iron-icon>Carrier Name</a>
                                        </gfs-dropdown-menu>
                                    </div>

                                    <div class="overflow-hidden hide">
                                        <div id="dropPointListContainer">
                                            <div id="dropPointList" class="hide-scroll">
                                                <dom-if if="{{_showDropPointList}}">
                                                    <template>
                                                        <dom-repeat items="{{reOrder(dropPoints)}}" as="dd" sort="_sortDropPoint">
                                                            <template>
                                                                <gfs-droppoint class$="droppoint-margin [[orientation]]"
                                                                                checkout-token="[[checkoutToken]]"
                                                                                container-class="dp-card"
                                                                                country-code="[[countryCode]]"
                                                                                show-opening-hours="[[showOpeningHours]]"
                                                                                droppoint-data="[[dd]]"
                                                                                show-distance="[[showDistance]]"
                                                                                is-standard-button="[[isStandardButton]]"
                                                                                button-selected-text="[[displayButtonText]]"
                                                                                button-deselected-text="[[displayButtonDeselectedText]]"
                                                                                orientation="[[orientation]]"
                                                                                checkout-uri="{{checkoutUri}}">
                                                                </gfs-droppoint>
                                                            </template>
                                                        </dom-repeat>
                                                    </template>
                                                </dom-if>

                                                <dom-if if="{{_showStoreList}}">
                                                    <template>
                                                        <dom-repeat items="{{reOrder(stores)}}" as="dd" sort="_sortDropPoint">
                                                            <template>
                                                                <gfs-store class$="droppoint-margin [[orientation]]"
                                                                        checkout-token="[[checkoutToken]]"
                                                                        container-class="dp-card"
                                                                        country-code="[[countryCode]]"
                                                                        show-opening-hours="[[showOpeningHours]]"
                                                                        store-data="[[dd]]"
                                                                        show-distance="[[showDistance]]"
                                                                        is-standard-button="[[isStandardButton]]"
                                                                        button-selected-text="[[displayButtonText]]"
                                                                        button-deselected-text="[[displayButtonDeselectedText]]"
                                                                        orientation="[[orientation]]"
                                                                        checkout-uri="{{checkoutUri}}">
                                                                </gfs-store>
                                                            </template>
                                                        </dom-repeat>
                                                    </template>
                                                </dom-if>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="droppointServices">
                                        <gfs-listbox att-for-selected="id" selected="[[preselectedService]]">
                                            <dom-repeat items="{{_selectedDroppointServices}}" sort="_sortServices">
                                                <template>
                                                    <gfs-item id="[[item.select]]" type$="[[item.type]]" on-click="updateDeliveryOptions">
                                                        [[item.description]] [[currencySymbol]][[_priceFix(item.costs.price)]] [[item.deliveryDateRange]]
                                                    </gfs-item>
                                                </template>
                                            </dom-repeat>
                                        </gfs-listbox>

                                        <div class="lcc lcc-charge-droppoint hide">The prices shown <strong>include</strong> import Duties and Taxes of {{currencySymbol}}{{taxAndDutyPrice}}</div>
                                        <div class="lcc lcc-estimate-droppoint hide">
                                            The prices shown <strong>exclude</strong> import Duties and Taxes. You may be charged an additional
                                            {{currencySymbol}}{{taxAndDutyPrice}} by your local customs office
                                        </div>
                                    </div>

                                </div>
                            </template>
                        </dom-if>
                    </iron-pages>
                </div>
            </div>

            <gfs-toast error id="notificationError"></gfs-toast>
        `;
    }

    static get properties() {
        return {
            orientation: {
                type: String,
                notify: true,
                value: 'horizontal'
            },

            initialAddress: String,

            /**
            * Delivery methods
            */
            useStandard: {
                type: Boolean,
                value: false
            },

            useCalendar: {
                type: Boolean,
                value: false
            },

            useDroppoints: {
                type: Boolean,
                value: false
            },

            useDroppointsStores: {
                type: Boolean,
                value: false
            },

            /**
            * Delivery methods titles
            */
            standardDeliveryTitle: {
                type: String,
                value: 'Standard delivery'
            },

            calendarDeliveryTitle: {
                type: String,
                value: 'Choose a delivery date and time'
            },

            calendarDayPrompt: {
                type: String,
                value: 'Select one of the following deliveries time:'
            },

            calendarDayNonPrompt: {
                type: String,
                value: 'Please select a delivery date.'
            },

            dropPointDeliveryTitle: {
                type: String,
                value: 'Click and Collect'
            },

            storeDeliveryTitle: {
                type: String,
                value: 'Store pickup'
            },

            /**
            * Option to sorting the service based on the following:
            * cheapestFirst, fastestFirst, expensiveFirst, slowestFirst
            */
            serviceSortOrder: {
                type: String,
                value: "cheapestFirst"
            },

            /**
            * Option to sorting the droppoint list based on the following:
            * distance, carriername, town
            */
            droppointSortList: {
                type: String,
                value: "distance"
            },

            /**
            * Checkout API
            */
            checkoutUri: {
                type: String,
                value: "//connect2.gfsdeliver.com"
            },

            checkoutRequest: {
                type: String,
                value: ""
            },

            checkoutToken: {
                type: String,
                value: ""
            },

            /**
            * Currency symbol to be shown in the services
            */
            currencySymbol: {
                type: String,
                value: "$"
            },

            /**
            * Sets the value for the default delivery method
            * 0: Standard, 1: DayDefinite , 2: Click&Collect, 3: Store pickup
            */
            defaultDeliveryMethod: {
                type: Number,
                value: 0
            },

            standardRates: {
                type: Array,
                notify: true,
            },

            standardDroppointRates: {
                type: Array,
                notify: true,
            },

            dropPoints: {
                type: Array,
                notify: true,
            },

            stores: {
                type: Array,
                notify: true,
            },

            dayDefinite: {
                type: Array,
                notify: true,
            },

            dayDefiniteDropPoint: {
                type: Array,
                notify: true,
            },

            dayDefiniteStore: {
                type: Array,
                notify: true,
            },

            // default service parameters when API is not available
            /**
            * If this is true, a default service will be available else a default message will be shown
            */
            showDefaultService: {
                type: Boolean,
                value: false
            },

            /**
            * show a default message
            * e.g.: default-message="Services are currently unavailable."
            */
            defaultMessage: {
                type: String,
                value: ""
            },

            /**
            * set default description for the service.
            * e.g.: default-description="Standard Delivery"
            */
            defaultDescription: String,

            /**
            * set default carrier for the service.
            * e.g.: default-carrier="YODEL"
            */
            defaultCarrier: String,

            /**
            * set the default price for custom service
            * e.g.: default-price='[{"currency": "GBP", "price": 2.50}]'
            */
            defaultPrice: Array,

            /**
            * The minimum delivery time in days of the default service to be offered to the customer in the event that the widget cannot contact the GFS Checkout server
            * Will be used to calculate the delivery range
            * e.g.: default-min-delivery-time="3"
            */
            defaultMinDeliveryTime: String,

            /**
            * The maximun delivery time in days of the default service to be offered to the customer in the event that the widget cannot contact the GFS Checkout server
            * Will be used to calculate the delivery range
            * e.g.: default-max-delivery-time="6"
            */
            defaultMaxDeliveryTime: String,

            /*
            * If set, will preselect the first service in the list
            */
            allowPreselectService: Boolean,

            selectedServiceDetails: {
                type: Object,
                value: {
                    collectionPoint: null,
                    currencySymbol: null,
                    deliveryAddress: null,
                    expDeliveryDateEnd: null,
                    expDeliveryDateStart: null,
                    selectedDropopintId: null,
                    service: null,
                    serviceId: null,
                    shipping: null
                }
            },

            closeCheckout: String,

            closeCheckoutData: {
                type: Object,
                value: {
                    checkoutSelectedServiceName: null,
                    checkoutSelectedPrice: null,
                    checkoutSelectedDroppointAddress: null
                }
            },

            _selectedDayDeliveries: {
                type: Object,
                value: null
            },

            /*
            * data used for closeCheckout
            */
            checkoutResults: {
                type: String,
                value: null
            },

            sessionid: {
                type: String,
                value: null
            },

            checkoutData: {
                type: String,
                value: null
            },

            endDayRequest: {
                type: Number,
                value: 13
            },

            // Calendar
            allowCalendarPreselect: Boolean,

            showCalendarNoServices: Boolean,

            calendarNoServices: {
                type: String,
                value: "There are no services available on this day "
            },

            /**
            * This property can be used to localize the elements month labels.
            */
            monthLabels: {
                type: Array,
                value: function () {
                    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                }
            },

            /**
            * This property can be used to localize the elements day labels. Do not change the order
            */
            dayLabels: {
                type: Array,
                value: function () {
                    return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
                }
            },

            /**
            * Disable previous month days
            */
            disablePrevDays: {
                type: Object,
                value: false
            },

            /**
            * Disable next month days
            */
            disableNextDays: {
                type: Object,
                value: false
            },

            /**
            * Disable week days. Set the disabled dates.
            * ex. disabled-dates="[4, 10, 12, 19, 30]".
            */
            disabledDates: {
                type: Array,
                value: []
            },

            /**
            * Disable week days. Set the disabled days. If you use custom dayLabels use the same values here.
            * ex. disabled-days='["Monday", "Thursday"]'.
            */
            disabledDays: {
                type: Object,
                value: function () {
                    return [];
                }
            },

            /**
            * Set the background color on the calendar for days that have deliveries.
            * Can be HEX, RGB(A), HSL(A) or color name. calendar-hight-lighted-bg="rgba(22, 118, 243, .8)"
            */
            calendarHightLightedBg: {
                type: String,
                value: "#828181"
            },

            /**
            * Set the color on the calendar for days that have deliveries.
            * Can be HEX, RGB(A), HSL(A) or color name. calendar-hight-lighted-color="red"
            */
            calendarHightLightedColor: {
                type: String,
                value: "#fff"
            },

            // gfs-droppoint properties
            showDistance: {
                type: Object,
                value: true
            },

            showOpeningHours: {
                type: Object,
                value: true
            },

            isStandardButton: {
                type: Object,
                value: true
            },

            displayButtonText: String,

            displayButtonDeselectedText: String,

            // Map
            /*
            *
            */
            postcodeSearchResultText: String,

            mapHeight: {
                type: String,
                value: 500
            },

            storeMapIcon: String,

            _showDropPointList: {
                type: Boolean,
                value: true
            },

            _showStoreList: {
                type: Boolean,
                value: false
            },

            /**
            *  Display or not the LCC message
            */
            showDutyMessage: {
                type: Object,
                value: true
            },

            /**
            *  LCC property to define if estimate or charge
            */
            taxAndDutyType: {
                type: String,
                value: "estimate",
                observer: "_taxAndDutyTypeChanged"
            },

            /**
            *  LCC value
            */
            taxAndDuty: {
                type: Number,
                value: 0,
                observer: "_taxAndDutyValueChanged"
            },

            /*
            * Checkout API response data
            */
            _checkoutResp: {
                type: Array,
                notify: true
            },

            _deliveryDays: {
                type: Object,
                value: {}
            },

            _deliveryDroppoints: {
                type: Object,
                value: {}
            },

            _isSelectedDroppoint: {
                type: Boolean,
                value: false
            }
        }
    }

    static get observers() {
        return [
            '_updateResponse(checkoutRequest, checkoutToken)',
            'droppointSortChanged(droppointSortList)'
        ]
    }

    ready() {
        super.ready();
        this._orientation = this.orientation;
        this._onResizeWindow();

        this.$.loader.style.display = 'block';

        this.allowPreselectService ? this.preselectedService = "0" : this.preselectedService = null;
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('dateSelected', this._deliveryDateSelected.bind(this));
        window.addEventListener('currentMonth', this._markDeliveryDays.bind(this));
        window.addEventListener('prevMonth', this._markDeliveryDays.bind(this));
        window.addEventListener('nextMonth', this._markDeliveryDays.bind(this));
        window.addEventListener('monthChanged', this._markDeliveryDays.bind(this));
        window.addEventListener('currMonth', this._markDeliveryDays.bind(this));
        window.addEventListener('store-changed', this._storeChanged.bind(this));
        window.addEventListener('droppoint-changed', this._droppointChanged.bind(this));
        window.addEventListener('clear-selected-droppoint', this._clearSelectedDroppoint.bind(this));
        window.addEventListener('resize', this._onResizeWindow.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener('dateSelected', this._deliveryDateSelected.bind(this));
        window.removeEventListener('currentMonth', this._markDeliveryDays.bind(this));
        window.removeEventListener('prevMonth', this._markDeliveryDays.bind(this));
        window.removeEventListener('nextMonth', this._markDeliveryDays.bind(this));
        window.removeEventListener('monthChanged', this._markDeliveryDays.bind(this));
        window.removeEventListener('currMonth', this._markDeliveryDays.bind(this));
        window.removeEventListener('store-changed', this._storeChanged.bind(this));
        window.removeEventListener('droppoint-changed', this._droppointChanged.bind(this));
        window.removeEventListener('clear-selected-droppoint', this._clearSelectedDroppoint.bind(this));
        window.removeEventListener('resize', this._onResizeWindow.bind(this));
    }

    formatNonDayDefiniteDate(startDate, endDate) {
        return '(Est. arrival: ' + format(startDate, "EEE, do MMMM") + ' - ' + format(endDate, "EEE, do MMMM") + ')';
    }

    formatDayDefiniteDate(deliveryDate) {
        return 'estimated arrival: ' + format(deliveryDate, "EEE, do MMMM") + '';
    }

    // if the token or data changes we need to re-query the server
    _updateResponse(request, token) {
        if (request === "" || token === "") {
            this.$.notificationError.text = "There has been an error processing your request. Exception id: gfs-hgd78-98jhb";
            this.$.notificationError.duration = 8000;
            this.$.notificationError.show();
            this.$.loader.style.display = 'none';
        }
        else {
            let createSession = this.$.createSession;
            createSession.url = this.checkoutUri + '/api/checkout/session';
            createSession.headers = this._getBearerToken();
            createSession.body = JSON.parse(atob(request));

            this.countryCode = createSession.body.order.delivery.destination.country;
            this.postCode = createSession.body.order.delivery.destination.zip;
            this.currency = createSession.body.options.currency;

            createSession.generateRequest();
            console.info('requestData: ', request);
        }
    }

    _getBearerToken() {
        return { "Authorization": "Bearer " + atob(this.checkoutToken) };
    }

    /**
    * Process the current response from Checkout, extract
    * the non-day-definite services that do not use Drop Points
    * for delivery, and return an array of objects representing
    * the services.
    *
    */
    _processStandard(options, callBack) {
        let elem = this;
        let services = [];

        options.standard.forEach((service) => {
            if (service.type === "home") {

                let obj = {
                    despatchDate: service.despatchDate,
                    select: service.select,
                    description: service.description,
                    costs: this.getServicePrice(service.costs),
                    type: service.type,
                    maxDD: service.maxDD,
                    minDD: service.minDD
                };

                let startDate = new Date(obj.despatchDate);
                let endDate = new Date(startDate);

                startDate.setDate(startDate.getDate() + obj.minDD);
                endDate.setDate(endDate.getDate() + obj.maxDD);

                obj.deliveryDateRange = elem.formatNonDayDefiniteDate(startDate, endDate);
                obj.deliveryTimeFrom = endDate.getTime();

                if (this.taxAndDutyType.toLowerCase() === "charge" && this.taxAndDuty > 0) {
                    const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                    const countryCode = checkoutRequest.order.delivery.origin.country;

                    if (countryCode !== "GB") {
                        for (let i = 0; i < obj.costs.length; i++) {
                            obj.costs[i].price = obj.costs[i].price + this.taxAndDuty;
                        }
                    }
                }

                services.push(obj);
            }
        });

        return callBack(services);
    }

    /**
    * Process the current response from Checkout, extract
    * the non-day-definite services that use Drop Points
    * for delivery, and return an array of objects representing
    * the services.
    *
    */
    _processStandardDroppoint(options, callBack) {
        let elem = this;
        let services = [];

        options.standard.forEach((service) => {
            if (service.type === "drop-point") {

                let obj = {
                    despatchDate: service.despatchDate,
                    description: service.description,
                    costs: this.getServicePrice(service.costs),
                    type: service.type,
                    maxDD: service.maxDD,
                    minDD: service.minDD,
                    dropPoints: service.dropPoints
                };

                let startDate = new Date(obj.despatchDate);
                let endDate = new Date(startDate);

                startDate.setDate(startDate.getDate() + obj.minDD);
                endDate.setDate(endDate.getDate() + obj.maxDD);

                obj.deliveryDateRange = elem.formatNonDayDefiniteDate(startDate, endDate);
                obj.deliveryTimeFrom = endDate.getTime();

                if (this.taxAndDutyType.toLowerCase() === "charge" && this.taxAndDuty > 0) {
                    const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                    const countryCode = checkoutRequest.order.delivery.origin.country;

                    if (countryCode !== "GB") {
                        for (let i = 0; i < obj.costs.length; i++) {
                            obj.costs[i].price = obj.costs[i].price + this.taxAndDuty;
                        }
                    }
                }

                services.push(obj);
            }
        });

        return callBack(services);
    }

    /**
    * Process the current response from Checkout, extract
    * the non-day-definite services that use Stores
    * for delivery, and return an array of objects representing
    * the services.
    *
    */
   _processStandardStore(options, callBack) {
        let elem = this;
        let services = [];

        options.standard.forEach((service) => {
            if (service.type === "store") {

                let obj = {
                    despatchDate: service.despatchDate,
                    description: service.description,
                    costs: this.getServicePrice(service.costs),
                    type: service.type,
                    maxDD: service.maxDD,
                    minDD: service.minDD,
                    stores: service.stores
                };

                let startDate = new Date(obj.despatchDate);
                let endDate = new Date(startDate);

                startDate.setDate(startDate.getDate() + obj.minDD);
                endDate.setDate(endDate.getDate() + obj.maxDD);

                obj.deliveryDateRange = elem.formatNonDayDefiniteDate(startDate, endDate);
                obj.deliveryTimeFrom = endDate.getTime();

                if (this.taxAndDutyType.toLowerCase() === "charge" && this.taxAndDuty > 0) {
                    const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                    const countryCode = checkoutRequest.order.delivery.origin.country;

                    if (countryCode !== "GB") {
                        for (let i = 0; i < obj.costs.length; i++) {
                            obj.costs[i].price = obj.costs[i].price + this.taxAndDuty;
                        }
                    }
                }

                services.push(obj);
            }
        });

        return callBack(services);
    }

    /**
    * Process the current response from Checkout, extract
    * the day-definite services that do not use Drop Points or store
    * for delivery, and return an array of objects representing
    * the services.
    */
    _processDayDefinite(options, callBack) {
        let services = [];

        options.dayDefinite.forEach((day) => {
            day.options.forEach((option) => {
                option.costs = this.getServicePrice(option.costs);

                if (option.type == 'home') {
                    option.deliveryTime = day.date;

                    if (this.taxAndDutyType.toLowerCase() === "charge" && this.taxAndDuty > 0) {
                        const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                        const countryCode = checkoutRequest.order.delivery.origin.country;

                        if (countryCode !== "GB") {
                            for (let i = 0; i < option.costs.length; i++) {
                                option.costs[i].price = option.costs[i].price + this.taxAndDuty;
                            }
                        }
                    }

                    services.push(option);
                }
            });
        });

        return callBack(services);
    }

    _processDayDefiniteAvailability(availability, callBack) {
        availability.forEach((item) => {
            let dateStr = item.date;

            for (var i = 0; item.options.length > i; i++) {
                if (item.options[i].type === "home") {
                    this._deliveryDays[dateStr] = item;
                }
            }
        });

        return callBack(this._deliveryDays);
    }

    /**
    * Process the current response from Checkout, extract
    * the day-definite services that do not Drop Points
    * for delivery, and return an array of objects representing
    * the services.
    *
    */
    _processDayDefiniteDropPoint(options, callBack) {
        let services = []

        options.dayDefinite.forEach((day) => {
            day.options.forEach((option) => {
                if (option.type == 'drop-point') {
                    option.despatchDate = day.date;
                    services.push(option);
                }
            });
        });

        return callBack(services);
    }

    /**
    * Process the current response from Checkout, extract
    * the day-definite services that do not Drop Points
    * for delivery, and return an array of objects representing
    * the services.
    *
    */
    _processDayDefiniteStore(options, callBack) {
        let services = []

        options.dayDefinite.forEach((day) => {
            day.options.forEach((option) => {
                if (option.type == 'store') {
                    option.despatchDate = day.date;
                    services.push(option);
                }
            });
        });

        return callBack(services);
    }

    /**
    * Process the current response from Checkout and return
    * information on the Drop Points it contains
    *
    */
    _processDropPoints(options, callBack) {
        if (options.dropPoints) {
            return callBack(options.dropPoints);
        }
        else {
            this.$.notificationError.text = "No droppoints has been configured";
            this.$.notificationError.open();
        }
    }

    /**
    * Process the current response from Checkout and return
    * information on the Drop Points it contains
    *
    */
   _processStores(options, callBack) {
        if (options.stores) {
            return callBack(options.stores);
        }
        else {
            this.$.notificationError.text = "No stores has been configured";
            this.$.notificationError.open();
        }
    }

    _sortServices(a, b) {
        if (a == b) return 0;

        switch (this.serviceSortOrder) {
            case "cheapestFirst":
                return a.costs.price < b.costs.price ? -1 : 1;
            case "fastestFirst":
                return a.deliveryTimeFrom < b.deliveryTimeFrom ? -1 : 1;
            case "expensiveFirst":
                return a.costs.price > b.costs.price ? -1 : 1;
            case "slowestFirst":
                return a.deliveryTimeFrom > b.deliveryTimeFrom ? -1 : 1;
            default:
                return a.costs.price < b.costs.price ? -1 : 1;
        }
    }

    _sortDropPoint(a, b) {
        if (a === b) return 0;

        switch (this.droppointSortList.replace(/\s/g, '')) {
            case "distance":
                return a.geo.distance > b.geo.distance ? 1 : -1;
            case "carriername":
                return a.provider.replace(/\s/g, '') > b.provider.replace(/\s/g, '') ? 1 : -1;
            case "town":
                return a.geoLocation.town > b.geoLocation.town ? 1 : -1;
            default:
                return a.geo.distance > b.geo.distance ? 1 : -1;
        }s
    }

    // return the prive and currency based on currency code request
    getServicePrice(costs) {
        for (let i = 0; i < costs.length; i++) {
            if (this.currency == costs[i].currency) {
                return costs[i]
            }
        }
    }

    droppointSortChanged(sort) {
        if (this.dropPoints) {
            const _dropPoints = this.dropPoints;
            this.dropPoints = [];

            _dropPoints.sort(this._sortDropPoint.bind(this));
            this.dropPoints = _dropPoints;
        }
    }

    reOrder(dropPoints) {
        return dropPoints;
    }

    changeDropPointSort(obj) {
        var sortOptions = this.shadowRoot.querySelectorAll('gfs-dropdown-menu')[0].querySelectorAll('a');

        for (let i = 0; i < sortOptions.length; i++) {
            sortOptions[i].classList.remove('sort-selected');
        }

        obj.currentTarget.classList.add('sort-selected')
        this.sortVal = obj.currentTarget.text.toLowerCase().replace(/\s/g, '');
        this.droppointSortList = obj.currentTarget.text.toLowerCase();
    }

    _markDeliveryDays(elem) {
        let shadow = this.shadowRoot;

        // clear date with no services
        this._selectedDayDeliveries = null;

        for (let dateStr in this._deliveryDays) {
            if (this._deliveryDays[dateStr].options.length > 0) {
                let selector = '.day[data-date="' + dateStr + '"]';
                let results = shadow.querySelectorAll('mp-calendar')[0]
                            .shadowRoot
                            .querySelectorAll(selector);

                if (results) {
                    for (let i = 0; i < results.length; i++) {
                        results[i].style.background = this.calendarHightLightedBg;
                        results[i].style.color = this.calendarHightLightedColor;
                        results[i].setAttribute('has-delivery', '');
                    }
                }
            }
        }
    }

    _deliveryDateSelected(e) {
        let deliveries = this._findDayDefiniteDeliveries(e.detail.date);
        this._selectedDayDeliveries = null;

        if (deliveries && deliveries.options.length > 0) {
            this.shadowRoot.querySelectorAll('#calendarLoader')[0].style.display = 'block';

            let availableServices = this.$.getAvailableServices;
            availableServices.url =  this.checkoutUri + '/api/checkout/session' + '/' + this._sessionId + '/options' + deliveries.select; ;

            availableServices.headers = this._getBearerToken();
            availableServices.generateRequest();

            this.lccNotification('calendar', true);
        }
        else {
            this.shadowRoot.querySelector('#calendar').chosen = [];
            this._selectedDayDeliveries = null;

            if (this.showCalendarNoServices) {
                this.$.notificationError.text = this.calendarNoServices;
                this.$.notificationError.open();
            }

            this.lccNotification('calendar', false);
        }

        this._fire("getCalendarSelectedService", "");
    }

    /**
    * Process the current response from Checkout and return
    * information on the daydefinite availability it contains
    *
    */
    _handleAvailableServicesResponse(e) {
        let services = [];
        this._dayDefinite = e.detail.response.deliveryOptions.dayDefinite;
        const dayDefinite = e.detail.response.deliveryOptions.dayDefinite;
        this.shadowRoot.querySelector('#calendarServices').querySelectorAll('gfs-listbox')[0].selected = null;

        dayDefinite.forEach(day => {
            day.options.forEach(option => {
                option.costs = this.getServicePrice(option.costs);

                if (option.type == 'home') {
                    option.deliveryTime = day.date;

                    if (this.taxAndDutyType.toLowerCase() === "charge" && this.taxAndDuty > 0) {
                        const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                        const countryCode = checkoutRequest.order.delivery.origin.country;

                        if (countryCode !== "GB") {
                            for (let i = 0; i < option.costs.length; i++) {
                                option.costs[i].price = option.costs[i].price + this.taxAndDuty;
                            }
                        }
                    }

                    services.push(option);
                }
            });
        });

        this.preselectedService = null;
        this._selectedDayDeliveries = services;
        this.shadowRoot.querySelectorAll('#calendarLoader')[0].style.display = 'none';

        let checkoutResultsData = this.parentElement.querySelector('#' + this.checkoutResults);
        if (!!checkoutResultsData) {
            checkoutResultsData.value = "";
        }
    }

    _findDayDefiniteDeliveries(onDate) {
        let dateStr = format(onDate, 'yyyy-MM-dd');

        if (typeof(this._deliveryDays[dateStr]) !== "undefined") {
            return this._deliveryDays[dateStr];
        }
        else {
            return null;
        }
    }

    _preselectForStandard() {
        var cheapestMethod = null;

        this.standardRates.forEach((service, i) => {
            if (cheapestMethod === null || (service.costs.price < cheapestMethod.costs.price)) {
                cheapestMethod = service;
            }
        });

        this._selectCheapestMethod(cheapestMethod);
    }

    _preselectForExpress() {
        var cheapestMethod = null;
        var preselectDay = false;

        if (this.allowCalendarPreselect) {
            const items = this._earliestDelivery;
            items.forEach( (item) => {
                if (cheapestMethod === null || (item.price < cheapestMethod.price)) {
                    cheapestMethod = item;
                    preselectDay = true;
                }
            });
        }

        if (cheapestMethod) {
            if (preselectDay) {
                let date = new Date(cheapestMethod.deliveryTimeFrom);
                let dateStr = date.getFullYear()+'-' + ((date.getMonth()+1) < 10 ? '0' : '') + (date.getMonth()+1) + '-'+date.getDate();
                this.shadowRoot.querySelector('mp-calendar').chosen = dateStr;

                cheapestMethod.date = new Date(cheapestMethod.deliveryTimeFrom);

                this._fire('dateSelected', cheapestMethod);

                if (this.defaultDeliveryMethod == 1) {
                    this._selectCheapestMethod(cheapestMethod);
                }
            }
            cheapestMethod.active = true;
        }
    }

    /**
    *   Reset selected service on change delivery method
    */
    _resetSelected(e) {
        if (this.useStandard) {
            this.shadowRoot.querySelector('#standarServices').querySelectorAll('gfs-listbox')[0].selected = null;

            if (this.useDroppoints) {
                this.shadowRoot.querySelector('#lastddPostcode').innerText = "";
            }

            this.preselectedService = null;
        }

        if (this.useCalendar) {
            this._selectedDayDeliveries = null;
            this.shadowRoot.querySelector('#calendar').chosen = "";
            this.shadowRoot.querySelector('#calendarServices').querySelectorAll('gfs-listbox')[0].selected = null;

            if (this.useDroppoints) {
                this.shadowRoot.querySelector('#lastddPostcode').innerText = "";
            }
        }

        if (this.useDroppoints) {
            this.shadowRoot.querySelector('#droppointServices').querySelectorAll('gfs-listbox')[0].selected = null;
            this.shadowRoot.querySelector('#lastddPostcode').innerText = "";

            this._fire('hide-collectionInfo');
        }

        let checkoutResultsData = this.parentElement.querySelector('#' + this.checkoutResults);
        if (!!checkoutResultsData) {
            checkoutResultsData.value = "";
        }

        this.selectedServiceDetails = {
            collectPoint: null,
            collectionPoint: null,
            currencySymbol: null,
            deliveryAddress: null,
            expDeliveryDateEnd: null,
            expDeliveryDateStart: null,
            selectedDropopintId: null,
            service: null,
            serviceId: null,
            shipping: null
        }

        this._fire("getStandardSelectedService", "");
        this._fire("getCalendarSelectedService", "");
        this._fire("getDroppointSelectedService", "");
    }

    /**
     * Find all the available services based on checkout select property
     */
    _getDeliveryRateById(select, type) {
        let combinedRateGroups;
        let options = [];
        let resultList;

        if (this.defaultDeliveryMethod == 0) {
            combinedRateGroups = this.standardRates;
            options = [];

            combinedRateGroups.forEach((group) => {
                if (group.type === "home") {
                    options = options.concat(group);
                }
            });

            resultList = options.filter((option) => {
                return option.select == select
            });

            if (resultList.length) {
                return resultList[0];
            }
        }

        if (this.defaultDeliveryMethod == 1) {
            combinedRateGroups = this._dayDefinite;
            options = [];

            combinedRateGroups.forEach((group) => {
                options = options.concat(group.options);
            });

            resultList = options.filter((option) => {
                return option.select == select
            });

            if (resultList.length) {
                if (this.useCalendar && this.defaultDeliveryMethod == 1) {
                    for (let i = 0; i < resultList.length; i++) {
                        if (resultList[i].deliveryTime === this.shadowRoot.querySelector('mp-calendar').chosen) {
                            return resultList[i];
                        }
                    }
                }
                else {
                    return resultList[0];
                }
            }
            else {
                return null;
            }
        }

        if (this.defaultDeliveryMethod == 2) {
            if (type === "drop-point") {
                combinedRateGroups = this.standardDroppointRates;
                options = [];

                combinedRateGroups.forEach((group) => {
                    if (group.type === "drop-point") {
                        options = options.concat(group);
                    }
                });

                resultList = options.filter((option) => {
                    let found = option.dropPoints.findIndex((droppoint) => {
                        return droppoint.select === select
                    })
                    return found !== -1
                });
            }
            else {
                combinedRateGroups = this.standardStoreRates;
                options = [];

                combinedRateGroups.forEach((group) => {
                    if (group.type === "store") {
                        options = options.concat(group);
                    }
                });

                resultList = options.filter((option) => {
                    let found = option.stores.findIndex((store) => {
                        return store.select === select
                    })
                    return found !== -1
                });
            }

            if (resultList.length) {
                return resultList[0];
            }
        }
    }

    _showDropPointsView() {
        this.shadowRoot.querySelector('#dropPointListContainer').classList.remove('hidden-droppoints');

        if (this.shadowRoot.querySelector('#toggleDropPointsView').checked) {
            this.shadowRoot.querySelector('#mapContainer').classList.remove('hide');
            this.shadowRoot.querySelector('.overflow-hidden').classList.add('hide');
            this.shadowRoot.querySelector('#ddMap').classList.add('active');
            this.shadowRoot.querySelector('#sortingDroppoint').classList.add('hide');
            this.shadowRoot.querySelector('#ddList').classList.remove('active');

            if (!!this._selectedDroppoint && !!this._selectedDroppoint.chosen) {
                this._fire("droppoint-selected", this._selectedDroppoint, this._selectedDroppoint.marker.customData.isDroppoint, this._selectedDroppoint.marker.customData.isStore)
            }
            else {
                this._fire("droppoint-unselected", this._selectedDroppoint, this._selectedDroppoint.marker.customData.isDroppoint, this._selectedDroppoint.marker.customData.isStore)
            }

            if (!!this._selectedStore && !!this._selectedStore.chosen) {
                this._fire("droppoint-selected", this._selectedStore, this._selectedStore.marker.customData.isDroppoint, this._selectedStore.marker.customData.isStore)
            }
        }
        else {
            this.shadowRoot.querySelector('#mapContainer').classList.add('hide');
            this.shadowRoot.querySelector('#ddMap').classList.remove('active');
            this.shadowRoot.querySelector('.overflow-hidden').classList.remove('hide');
            this.shadowRoot.querySelector('#sortingDroppoint').classList.remove('hide');
            this.shadowRoot.querySelector('#ddList').classList.add('active');

            // hightlight sorting option based on droppointSortList property
            var sortOptions = this.shadowRoot.querySelectorAll('gfs-dropdown-menu')[0].querySelectorAll('a');

            for (let i = 0; i < sortOptions.length; i++) {
                if (sortOptions[i].text.toLowerCase() === this.droppointSortList) {
                    sortOptions[i].classList.add('sort-selected');
                }
                else {
                    sortOptions[i].classList.remove('sort-selected');
                }
            }
        }
    }

    _unselectDroppoint() {
        if (this._selectedDroppoint) {
            this._selectedDroppoint.chosen = false;

            if (this._selectedDroppoint.isDroppoint) {
                let icon = this._droppointMapIco(this.countryCode) + '/' + this._selectedDroppoint.provider.toLowerCase() + '.png';
                this._selectedDroppoint.marker.setIcon(icon);
            }
        }
    }

    _unselectStore() {
        if (this._selectedStore) {
            this._selectedStore.chosen = false;

            if (this._selectedStore.isDroppoint) {
                let icon = this._droppointMapIco(this.countryCode) + '/' + this._selectedStore.provider.toLowerCase() + '.png';
                this._selectedStore.marker.setIcon(icon);
            }
        }
    }

    _storeChanged(e) {
        const changedStore = e.detail.data;
        const deliveries = this._findStoreDeliveries(changedStore.id);

        this._selectedDroppointServices = deliveries;

        this.shadowRoot.querySelector('#droppointServices').querySelectorAll('gfs-listbox')[0].selected = null;

        if (this._selectedStore) {
            if (changedStore.id !== this._selectedStore.id) {
                this._unselectDroppoint();
                this._unselectStore();
            }
        }

        this._isSelectedDroppoint = false;
        this._selectedStore = changedStore;

        this._fire("getDroppointSelectedService");
    }

    _droppointChanged(e) {
        const changedDroppoint = e.detail.data;
        const deliveries = this._findDropPointDeliveries(changedDroppoint.id);

        if (changedDroppoint.chosen) {
            this._selectedDroppointServices = deliveries;
        }
        else {
            this._selectedDroppointServices = null;
            this.shadowRoot.querySelector('gfs-droppoint-map')._infoWindow.close();
            this.shadowRoot.querySelector('gfs-droppoint-map')._infoWindow.opened = false;
        }

        this.shadowRoot.querySelector('#droppointServices').querySelectorAll('gfs-listbox')[0].selected = null;

        if (this._selectedDroppoint) {
            if (changedDroppoint.id !== this._selectedDroppoint.id) {
                this._unselectStore();
                this._unselectDroppoint();
            }
        }

        let checkoutResultsData = this.parentElement.querySelector('#' + this.checkoutResults);
        if (!!checkoutResultsData) {
            checkoutResultsData.value = "";
        }

        this._isSelectedDroppoint = true;
        this._selectedDroppoint = changedDroppoint;

        this._fire("getDroppointSelectedService");
    }

    _clearSelectedDroppoint(e) {
        this._selectedDroppoint = null;
        this._selectedDroppointServices = null
    }

    _droppointMapIco(countryCode) {
        var url = this.resolveUrl('//gfswidgetcdn.azurewebsites.net/images/widgets2.0/carriers/');

        switch (countryCode) {
            case "DE":
                return url + 'DE';
            case "FR":
            case "BE":
            case "ES":
                return url + 'FR';
            default:
                return url + 'GB';
        }
    }

    _findDropPointDeliveries(providerId) {
        let standardDroppointRates = this.standardDroppointRates;
        var retVal = [];

        standardDroppointRates.forEach((droppoint) => {
            for (let i = 0; i < droppoint.dropPoints.length; i++) {
                if (providerId == droppoint.dropPoints[i].dropPoint) {
                    droppoint.select = droppoint.dropPoints[i].select;
                    retVal.push(droppoint);
                }
            }
        });

        return retVal;
    }

    _findStoreDeliveries(providerId) {
        let standardStoreRates = this.standardStoreRates;
        var retVal = [];

        standardStoreRates.forEach((store) => {
            for (let i = 0; i < store.stores.length; i++) {
                if (providerId == store.stores[i].store) {
                    store.select = store.stores[i].select;
                    retVal.push(store);
                }
            }
        });

        return retVal;
    }

    _searchPostcode(e) {
        const mapElem = this.shadowRoot.querySelector('gfs-droppoint-map');
        const val = this.shadowRoot.querySelector('#droppointAddress').value;

        if (val !== "" || val.length >= 3) {
            this.isBtnDisabled = true;
            this.shadowRoot.querySelectorAll('#mapLoader')[0].style.display = 'block';
            mapElem._searchPostcode(e, this);
        }
        else {
            this.$.notificationError.text = "Please enter a postcode";
            this.$.notificationError.classList.remove('fit-top');
            this.$.notificationError.horizontalAlign = "left";
            this.$.notificationError.verticalAlign = "top";
            this.$.notificationError.fitInto = this.shadowRoot.querySelector('gfs-droppoint-map').shadowRoot.querySelector('#droppointMap');
            this.$.notificationError.open();
        }
    }

    _showStores() {
        if (this.shadowRoot.querySelector('#toggleStoreOnMap').checked) {
            this.shadowRoot.querySelector('#droppointServices').querySelectorAll('gfs-listbox')[0].selected = null;
            this._showStoreList = true;
            this._selectedDroppointServices = null;
            this._fire('loadDroppointMarkers', this.stores, false, true);
            this._fire('hide-collectionInfo');
            this._fire('clear-selected-store');
        }
        else {
            this._showStoreList = false;
            this._fire('clearMarkers', 'stores', false, true);
        }
    }

    _hideDropPoints() {
        if (this.shadowRoot.querySelector('#toggleDropPointsOnMap').checked) {
            this.shadowRoot.querySelector('#sortinglist').disabled = true;
            this.shadowRoot.querySelector('.overflow-hidden').classList.add('hide');
            this.shadowRoot.querySelector('#droppointServices').querySelectorAll('gfs-listbox')[0].selected = null;
            this._showDropPointList = false;
            this._selectedDroppointServices = null;
            this._fire('clearMarkers', 'droppoints', true, false);
            this._fire('hide-collectionInfo');
            this._fire('clear-selected-droppoint');
        }
        else {
            this.shadowRoot.querySelector('#sortinglist').disabled = false;
            this._showDropPointList = true;
            this._fire('loadDroppointMarkers', this.dropPoints, true, false);
        }
    }

    _priceFix(price) {
        return parseFloat(price).toFixed(2);
    }

    // Update selected delivery option servive
    updateDeliveryOptions(e) {
        let method = this._getDeliveryRateById(e.currentTarget.id, e.currentTarget.getAttribute('type'));

        if (method != null) {
            this.selectedServiceDetails.serviceId = e.currentTarget.id;
            this.selectedServiceDetails.service = method.description;
            this.selectedServiceDetails.shipping = method.costs;
            this.selectedServiceDetails.expDeliveryDateStart = format(addDays(new Date(method.despatchDate), method.minDD ? method.minDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.expDeliveryDateEnd = format(addDays(new Date(method.despatchDate), method.maxDD ? method.maxDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.currencySymbol = this.currencySymbol;
            this.closeCheckoutData.checkoutSelectedServiceName = method.description;
            this.closeCheckoutData.checkoutSelectedPrice = this.getServicePrice(method.costs);

            if (this.defaultDeliveryMethod == 1) {
                this.selectedServiceDetails.deliveryTime = method.deliveryTime;
            }

            if (this.useDroppoints && this.defaultDeliveryMethod == 2) {
                if (this._isSelectedDroppoint) {
                    this.selectedServiceDetails.collectionPoint = this._selectedDroppoint.id;
                    this.selectedServiceDetails.deliveryAddress = this._selectedDroppoint.address;
                }
                else {
                    this.selectedServiceDetails.collectionPoint = this._selectedStore.id;
                    this.selectedServiceDetails.deliveryAddress = this._selectedStore.address;
                }
            }
            else {
                this.selectedServiceDetails.collectionPoint = null;
                this.selectedServiceDetails.deliveryAddress = JSON.parse(atob(this.checkoutRequest)).order.delivery.destination;
            }

            this.closeCheckout = method.select;

            if (this.defaultDeliveryMethod == 0) {
                this._fire("getStandardSelectedService", this.selectedServiceDetails);
            }

            if (this.defaultDeliveryMethod == 1) {
                this._fire("getCalendarSelectedService", this.selectedServiceDetails);
            }

            if (this.defaultDeliveryMethod == 2) {
                this._fire("getDroppointSelectedService", this.selectedServiceDetails);
            }

            let checkoutResultsData = this.parentElement.querySelector('#' + this.checkoutResults);
            if (!!checkoutResultsData) {
                checkoutResultsData.value = btoa(this.closeCheckout);
            }

            let sessionID = this.parentElement.querySelector('#' + this.sessionid);
            if (!!sessionID) {
                sessionID.value = btoa(this._sessionId);
            }

            let checkoutData = this.parentElement.querySelector('#' + this.checkoutData);
            if (!!checkoutData) {
                checkoutData.value = btoa(JSON.stringify(this.closeCheckoutData));
            }
        }
    }

    _selectCheapestMethod(cheapestMethod) {
        let method = this._getDeliveryRateById(cheapestMethod.select);

        if (method != null) {
            this.selectedServiceDetails.serviceId = method.select;
            this.selectedServiceDetails.service = method.description;
            this.selectedServiceDetails.shipping = method.costs;
            this.selectedServiceDetails.expDeliveryDateStart = format(addDays(new Date(method.despatchDate), method.minDD ? method.minDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.expDeliveryDateEnd = format(addDays(new Date(method.despatchDate), method.maxDD ? method.maxDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.checked = cheapestMethod.selected;
            this.selectedServiceDetails.currencySymbol = this.currencySymbol;

            this.closeCheckout = method.select;
            this.closeCheckoutData.checkoutSelectedServiceName = method.description;
            this.closeCheckoutData.checkoutSelectedPrice = this.getServicePrice(method.costs);

            if (this.defaultDeliveryMethod == 1) {
                this.selectedServiceDetails.deliveryTime = method.deliveryTime;
            }

            if (this.useDroppoints && this.defaultDeliveryMethod == 2) {
                this.selectedServiceDetails.collectionPoint = this._selectedDroppoint.id;
                this.selectedServiceDetails.deliveryAddress = this._selectedDroppoint.address;
                this.closeCheckoutData.checkoutSelectedDroppointAddress = this._selectedDroppoint.address.toString();
            }
            else {
                this.selectedServiceDetails.selectedDropopintId = null;
            }

            this._fire('selectedServiceChanged', this.selectedServiceDetails);

            if (this.defaultDeliveryMethod == 0) {
                this._fire("getStandardSelectedService", this.selectedServiceDetails);
            }

            if (this.defaultDeliveryMethod == 1) {
                this._fire("getCalendarSelectedService", this.selectedServiceDetails);
            }

            if (this.defaultDeliveryMethod == 2) {
                this._fire("getDroppointSelectedService", this.selectedServiceDetails);
            }

            let checkoutResultsData = this.parentElement.querySelector('#' + this.checkoutResults);
            if (!!checkoutResultsData) {
                checkoutResultsData.value = btoa(this.closeCheckout);
            }

            let sessionID = this.parentElement.querySelector('#' + this.sessionid);
            if (!!sessionID) {
                sessionID.value = btoa(this._sessionId);
            }

            let checkoutData = this.parentElement.querySelector('#' + this.checkoutData);
            if (!!checkoutData) {
                checkoutData.value = btoa(JSON.stringify(this.closeCheckoutData));
            }
        }
    }

    lccNotification(deliveryMethod, isVisible) {
        var lccCharge = dom(this.root).querySelectorAll(".lcc-charge-" + deliveryMethod);
        var lccEstimate = dom(this.root).querySelectorAll(".lcc-estimate-" + deliveryMethod);
        var checkoutRequest = JSON.parse(atob(this.checkoutRequest));
        var countryCode = checkoutRequest.order.delivery.origin.country;

        // hide all
        for (var i = 0; i < lccCharge.length; i++) {
            lccCharge[i].classList.add('hide');
        }

        for (var i = 0; i < lccEstimate.length; i++) {
            lccEstimate[i].classList.add('hide');
        }

        if (isVisible) {
            if (countryCode !== "GB") {
                if (this.showDutyMessage) {
                    if (this.taxAndDuty > 0) {
                        this.taxAndDutyPrice = this.taxAndDuty.toFixed(2);

                        if (this.taxAndDutyType.toLowerCase() === "estimate") {
                            for (let i = 0; i < lccEstimate.length; i++) {
                                lccEstimate[i].classList.remove('hide');
                            }
                        }
                        else {
                            for (let i = 0; i < lccCharge.length; i++) {
                                lccCharge[i].classList.remove('hide');
                            }
                        }
                    }
                }
            }
        }
    }

    _taxAndDutyTypeChanged(val, oldVal) {
        if (this.taxAndDutyType.toLowerCase() !== oldVal && oldVal !== undefined) {
            if (this.taxAndDutyType.toLowerCase() === "charge" || this.taxAndDutyType.toLowerCase() === "estimate") {
                const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
                const countryCode = checkoutRequest.order.delivery.origin.country;

                if (countryCode !== "GB") {
                    this.$.loader.style.display = 'block';
                    this.defaultDeliveryMethod = 1;
                    this._updateResponse(this.checkoutToken, this.checkoutRequest);
                }
            }
        }
    }

    _taxAndDutyValueChanged(val, oldVal) {
        if (this.taxAndDuty !== oldVal && oldVal !== undefined) {
            const checkoutRequest = JSON.parse(atob(this.checkoutRequest));
            const countryCode = checkoutRequest.order.delivery.origin.country;

            if (countryCode !== "GB") {
                this.$.loader.style.display = 'block';
                this.taxAndDutyPrice = val.toFixed(2);
                this.defaultDeliveryMethod = 1;
                this._updateResponse(this.checkoutToken, this.checkoutRequest);
            }
        }
    }

    _noServices(e) {
        // Check if the default-* values are defined
        if (this.defaultDescription != "" || this.defaultCarrier != "" || this.defaultMinDeliveryTime != "" || this.defaultMaxDeliveryTime != "" || this.defaultPrice != "") {
            // create an array for polymer
            this.standardRates = [];
            let today = new Date();
            let startDate = new Date(today);
            let endDate = new Date(startDate);

            startDate.setDate(startDate.getDate() + parseInt(this.defaultMinDeliveryTime));
            endDate.setDate(endDate.getDate() + (this.defaultMaxDeliveryTime - 1));

            this.standardRates = [{
                despatchDate: format(endDate, "yyyy-MM-dd"),
                select: null,
                description: this.defaultDescription,
                costs: this.getServicePrice(this.defaultPrice),
                type: "home",
                maxDD: this.defaultMaxDeliveryTime,
                minDD: this.defaultMinDeliveryTime,
                deliveryDateRange: this.formatNonDayDefiniteDate(startDate, endDate),
                deliveryTimeFrom: endDate.getTime()
            }];

            this.defaultDeliveryMethod = 0; // set delivery method to standard

            let method = this.standardRates[0];

            this.selectedServiceDetails.serviceId = method.select;
            this.selectedServiceDetails.service = method.description;
            this.selectedServiceDetails.shipping = method.costs;
            this.selectedServiceDetails.expDeliveryDateStart = format(addDays(new Date(method.despatchDate), method.minDD ? method.minDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.expDeliveryDateEnd = format(addDays(new Date(method.despatchDate), method.maxDD ? method.maxDD : 0), 'yyyy-MM-dd');
            this.selectedServiceDetails.currencySymbol = this.currencySymbol;
            this.closeCheckoutData.checkoutSelectedServiceName = method.description;
            this.closeCheckoutData.checkoutSelectedPrice = this.getServicePrice(method.costs);

            this._fire('getStandardSelectedService', this.selectedServiceDetails);
        }
        else {
            this.standardRates = [];
            this.$.notificationError.text = "The default service has not been configured, please contact website support";
            this.$.notificationError.classList.add('fit-top');
            this.$.notificationError.duration = 8000;
            this.$.notificationError.open();
        }

        // hide all delivery options except standard
        this.useCalendar = false;
        this.useDroppoints = false;
        this.useStores = false;
    }

    _onResizeWindow() {
        const width = window.innerWidth;

        if (width <= 414) {
            this.orientation = "horizontal";
        }
        else {
            this.orientation = this._orientation;
        }
    }

    _fire(ev, el, isDroppoint, isStore) {
        this.dispatchEvent(new CustomEvent(ev, {
            bubbles: true,
            composed: true,
            detail: {
                data: el,
                droppoint: isDroppoint,
                store: isStore
            }
        }));
    }

    // handlers
    _handleSessionResponse(e, request) {
        let checkoutOptions = this.$.checkoutOptions;
        let checkoutRequest = JSON.parse(atob(this.checkoutRequest));
        let startDate = checkoutRequest.options.startDate;
        let dateTo = new Date(checkoutRequest.options.startDate);
        let endDate = addDays(dateTo, this.endDayRequest >= 14 ? 13 : this.endDayRequest);
        endDate = format(endDate, "yyyy-MM-dd");


        this._sessionId = request.xhr.getResponseHeader('location');
        checkoutOptions.url = this.checkoutUri + '/api/checkout/session' + '/' + this._sessionId + "/options?start-date=" + startDate + "&end-date=" + endDate;

        let sessionID = this.parentElement.querySelector('#' + this.sessionid);
        if (!!sessionID) {
            sessionID.value = btoa(this._sessionId);
        }

        checkoutOptions.headers = this._getBearerToken();
        checkoutOptions.generateRequest();
    }

    _getDayDefiniteAvailability() {
        let checkoutDayDefinite = this.$.checkoutDayDefinite;

        checkoutDayDefinite.url = this.checkoutUri + '/api/checkout/session' + '/' + this._sessionId + '/daydefinite/availability';
        checkoutDayDefinite.headers = this._getBearerToken();
        checkoutDayDefinite.generateRequest();
    }

    _handleCheckoutOptionsResponse(e) {
        let checkoutResp = e.detail.response.deliveryOptions;

        this._checkoutResp = e.detail.response.deliveryOptions;
        this._standardRates = this._checkoutResp.standard;
        this._dropPoints = this._checkoutResp.dropPoints;
        this._stores = this._checkoutResp.stores;
        this.shadowRoot.querySelectorAll('#mapLoader')[0].style.display = 'none';

        if (this.useCalendar) {
            this._getDayDefiniteAvailability();
        }

        if (this.useStandard) {
            this._processStandard(checkoutResp, (options) => {
                this.standardRates = options;
                this._fire('newStandardOptions', options);

                if (this.defaultDeliveryMethod == 0 && this.standardRates.length > 0) {
                    this._preselectForStandard();
                }
            });
        }

        this._processDayDefiniteDropPoint(checkoutResp, (options) => {
            this.dayDefiniteDropPoint = options;
            this._fire('newDayDefiniteDropPointOptions', options);
        });

        if (this.useDroppoints) {
            this._processDropPoints(checkoutResp, (dropPoints) => {
                this.dropPoints = dropPoints;
                this._fire('newDroppoints', dropPoints, true, false);
            });

            this._processStandardDroppoint(checkoutResp, (options) => {
                this.standardDroppointRates = options;
                this._fire('newStandardDropPointOptions', options);
            });
        }

        if (this.useDroppointsStores) {
            this._processStores(checkoutResp, (stores) => {
                this.stores = stores;
                this._fire('newStores', stores, false, true);
            });

            this._processStandardStore(checkoutResp, (options) => {
                this.standardStoreRates = options;
                this._fire('newStandardStoreOptions', options);
            });

            this._processDayDefiniteStore(checkoutResp, (options) => {
                this.dayDefiniteStore = options;
                this._fire('newDayDefiniteStoreOptions', options);
            });
        }

        this.lccNotification('standard', true);
    }

    _handleCheckoutDayDefiniteResponse(e) {
        let availability = e.detail.response.availability;
        this.$.loader.style.display = 'none';

        this._processDayDefiniteAvailability(availability, (options) => {
            this.dayDefinite = options;

            this._fire('newAllDeliveryDays', options);

            if (this.useCalendar) {
                this._markDeliveryDays(this);
            }
        });
    }

    _handleError(e) {
        if (e.detail.error.type === "timeout") {
            if (this.showDefaultService) {
                this._noServices();
            }
            else {
                this.$.notificationError.text = "Server Took Too Long To Respond";
                this.$.notificationError.classList.add('fit-top');
                this.$.notificationError.open();
            }
        }
        else {
            if (this.showDefaultService) {
                this._noServices();
            }
            else {
                console.error('Error: ', e.detail.error.message);
                this.$.notificationError.text = e.detail.error.message;
                this.$.notificationError.classList.add('fit-top');
                this.$.notificationError.open();
            }
        }

        this.shadowRoot.querySelectorAll('#mapLoader')[0].style.display = 'none';
        this.shadowRoot.querySelectorAll('#calendarLoader')[0].style.display = 'none';
        this.$.loader.style.display = 'none';
    }
}
window.customElements.define('gfs-checkout', GfsCheckout);
