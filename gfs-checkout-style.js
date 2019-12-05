import '@polymer/polymer/polymer-element.js';

const GfsCheckoutStyle = document.createElement('template');

GfsCheckoutStyle.innerHTML = `
    <dom-module id="gfs-checkout-style">
        <template>
            <style>
                :host {
                    font-size: var(--font-size);
                    font-family: var(--font-family);
                    min-height: 150px;
                    position: relative;
                    display: block;

                    --font-family: "Segoe UI", 'Helvetica Neue';
                    --font-size: 14px;

                    --white-color: #fff;
                    --black-color: #000;
                    --gfs-blue-color: #3367d6;
                    --grey-color: #4c4c4c;
                    --light-grey-color: #e0e0e0;
                    --dark-grey-color: #212121;
                    --gfs-red-color: #d60000;
                    --paper-tabs-selection-bar: #3367d6;
                    --has-service-bg: #666464;
                    --has-service-color: #fff;

                    --main-bg: #000;
                    --header-bg: #000;
                    --main-header-color: #fff;
                    --header-icon-bg: #f33127;
                    --labels-color: #fff;
                    --border-width: 1px;
                    --border-color: rgba(255, 255, 255, .2);
                    --prev-days-color: #fff;
                    --curr-days-color: #fff;
                    --prev-next-days-bg: rgba(158, 21, 14, 0.6);
                    --next-days-color: #fff;
                    --disabled-color: rgba(255, 255, 255, .3);
                    --disabled-text-shadow: 0 0 2px rgba(255, 255, 255, .35);
                    --today-boxshadow-color: #f33127;
                    --calendar-hight-lighted-bg: #828181;
                    --selected-day-hover-bg: rgba(255, 13, 0, .5);
                    --selected-service-bg-hover: rgba(248, 248, 248, .65);
                    --ease-in-out: .3s all ease-in-out;
                    --shipping-method-price-color: #29a54f;
                    --shipping-method-price-font-weight: bold;
                    --shipping-method-estimate-font-size: 13px;
                    --shipping-method-estimate-font-style: italic;
                    --gfs-button-border-radius: 0;
                    --gfs-dropdown-menu-border-radius: 0;
                    --gfs-dropdown-menu-top-border: 5px solid var(--lumo-primary-text-color);
                    --gfs-dropdown-menu-arrow:  var(--lumo-primary-text-color);
                    --droppoint-sort-selected: #d8d8d8;
                    --gfs-dropdown-menu-background: #f8f8f8;
                    --gfs-dropdown-menu-background-hover: #dedddd;
                    --gfs-dropdown-menu-border-radius: 3px 3px 0 0;
                    --gfs-dropdown-item-hover: #e2e0e0;
                    --font-size: 14px;

                    --cld-selected-day-bg: #006df0;

                    --paper-tabs-selection-bar: {
                        border-color: var(--paper-tabs-selection-bar);
                    }

                    --paper-tabs-selection-bar-color: {
                        background: var(--paper-tabs-selection-bar);
                    }

                    --paper-tab-ink: {
                        color: var(--gfs-blue-color);
                    }

                    --layout-flex: {
                        display: flex;
                        display: -ms-flexbox;
                        display: -webkit-flex;
                    }

                    --gfs-listbox: {
                        border-top: 1px solid #ccc;
                        border: var(--gfs-listbox-gfs-checkout, none);
                    }

                    --gfs-item: {
                        margin: 0 0 20px;
                        padding: 15px;

                        border: 1px solid #c5c0c0;

                        @apply(--gfs-item-gfs-checkout);
                    }
                }

                h4 {
                    font-size: 16px;
                    color: var(--gfs-red-color);
                    margin: 15px 0;
                }

                    h4.grey {
                        color: var(--grey-color);
                    }

                .vertical {
                    padding: 0;
                    @apply(--layout-flex);
                }

                .hide {
                    display: none !important;
                }

                #loader, #calendarLoader, #mapLoader {
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.2);
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 9999;
                    display: none;
                }

                paper-spinner {
                    --paper-spinner-stroke-width: 10px;

                    width: 120px;
                    height: 120px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-left: -60px;
                    z-index: 100
                }

                #gfsDeliveryOptionTabs .horizontal {
                    padding: 0;
                }

                    #gfsDeliveryOptionTabs paper-tab {
                        font-size: 16px;
                        @apply --layout-center-center;
                    }

                        #gfsDeliveryOptionTabs paper-tab:focus, :host .tab-content:focus {
                            font-weight: normal !important;
                        }

                        paper-tabs {
                            background: var(--light-grey);
                            color: var(--dark-grey);
                        }

                            paper-radio-button.radio {
                                --paper-radio-button-checked-color: var(--paper-green-500);
                                --paper-radio-button-unchecked-color: var(--paper-black-900);
                                margin: 0;
                                padding: 21px 10px;
                                width: 100%;
                                border-bottom: 1px solid lightgrey;
                                display: block;
                                box-sizing: border-box;
                            }

                                paper-radio-button.radio:first-child {
                                    border-top: 1px solid lightgrey;
                                }

                                .delivery-services paper-radio-button.radio:last-child {
                                    border-bottom: none;
                                    background: red;
                                }

                                paper-radio-button.radio span {
                                    color: #797979;
                                }

                                    paper-radio-button.radio span.price {
                                        color: #29a54f;
                                        font-weight: bold;
                                    }


                    paper-tabs paper-tab.iron-selected, .tab-content {
                        background: #9e9e9e;
                        font-weight: normal !important;
                    }

                    vaadin-tabs[orientation="vertical"] {
                        background: #f8f8f8;
                        font-size: 12px;
                        margin: 0 15px 0 0;
                        padding: 0 0 5px;
                        flex: 0 1 auto;
                        box-shadow: none;
                        border-radius: 3px;
                        /*flex: 0 1 185px;*/
                        /*box-shadow: 1px 0 0 0 var(--lumo-contrast-10pct);*/
                    }

                        vaadin-tabs vaadin-tab:hover {
                            cursor: pointer;
                        }

                        vaadin-tabs[orientation="vertical"] vaadin-tab {
                            /*background: #f8f8f8;*/
                            font-size: 14px;
                            text-align: left;
                            margin: 0;
                            padding: 15px 10px;
                            line-height: 16px;
                            /*border-right: 1px solid var(--lumo-contrast-10pct);*/
                            transition: all .3s ease-in-out;
                        }

                            vaadin-tabs[orientation="vertical"] vaadin-tab:hover {
                                background: #eaeaea;
                            }

                            vaadin-tabs[orientation="vertical"] vaadin-tab:first-child {
                                margin-top: 5px;
                            }

                    vaadin-tabs[orientation="horizontal"] {
                        background: #f8f8f8;
                        margin-bottom: 20px;
                        border-bottom: none;
                        box-shadow: none;
                    }

                        vaadin-tabs[orientation="horizontal"] vaadin-tab {
                            font-size: 15px;
                            transition: all .3s ease-in-out;
                        }

                            vaadin-tabs[orientation="horizontal"] vaadin-tab:hover {
                                background: #d8d8d8;
                            }

                            vaadin-tabs[orientation="horizontal"] vaadin-tab::before {
                                width: 100%;
                            }

                            vaadin-tabs[orientation="horizontal"] vaadin-tab iron-icon {
                                width: 20px;
                                height: 20px;
                                flex: none;
                            }


                    paper-tabs {
                        display: flex
                    }

                    iron-pages {
                        padding: 0;
                        flex: 1 0 0%;
                    }

                    #calendarWrap, #ddWrap {
                        position: relative;
                    }

                    .available-service, .unavailable-service, .selected-service {
                        margin: 15px 10px 15px 30px;
                        display: inline-block;
                        position: relative;
                    }

                        .available-service::before, .unavailable-service::before, .selected-service::before {
                            content: '';
                            width: 20px;
                            height: 20px;
                            background: var(--calendar-hight-lighted-bg);
                            position: absolute;
                            top: -3px;
                            left: -30px;
                        }

                    .unavailable-service {

                    }

                        .unavailable-service::before {
                            background: #fff;
                            border: var(--border-width) solid var(--border-color);
                        }

                        .selected-service {

                        }

                            .selected-service::before {
                                background: var(--cld-selected-day-bg);
                            }

                    paper-radio-group {
                        width: 100%;
                    }

                    ul.separated {
                        margin: 0;
                        padding: 0;
                    }

                        ul.separated li {
                            padding: 21px 10px;
                            border-bottom: 1px solid #ececec;
                            list-style: none;
                            transition: var(--ease-in-out);
                        }

                        ul.separated li:first-child {
                            border-top: 1px solid #ececec;
                        }

                            ul.separated li:hover {
                                background: var(--selected-service-bg-hover);
                            }

                            ul.separated input[type=radio] {
                                min-height: 13px;
                                width: 13px;
                                height: 13px;
                                padding: 0;
                                margin:0;
                                vertical-align: text-bottom;
                                position: relative;
                                top: -1px;
                                *overflow: hidden;
                            }

                            li.delivery-place label {
                                color: var(--grey-color);
                                margin: 0 0 0 4px;
                                vertical-align: 0;
                                display: initial;
                            }

                                li.delivery-place label:hover {
                                    cursor: pointer;
                                }

                            span.price {
                                color: var(--shipping-method-price-color);
                                font-weight: var(--shipping-method-price-font-weight);
                            }

                            li.delivery-place label span.estimate {
                                font-size: var(--shipping-method-estimate-font-size);
                                font-style: var(--shipping-method-estimate-font-style);
                            }

                        .lcc {
                            margin: 35px 0 5px;
                            font-size: 12px;
                        }

                    mp-calendar {
                        font-family: var(--font-family);
                        font-size: var(--font-size);

                        --border-radius: 0;
                        --border-radius-header: 0;
                        --selected-day-bg: var(--cld-selected-day-bg) !important;
                    }


                    #toggleDropPointsViewControls, .storeHeader, #toggleStoresViewControls {
                        display: flex;
                        margin: 0 0 20px;
                        padding: 0 0 3px;
                        border-bottom: 1px solid #ccc;
                        color: #797979;
                        box-shadow: 0 2px 0 0 rgba(255, 255, 255, .7);
                    }

                    .toggle-label {
                        font-size: 17px;
                        font-weight: 500;
                        line-height: 24px;
                        margin-right: 0.4em;
                        display: flex;
                    }

                        .toggle-label iron-icon {
                            width: 24px;
                            height: 24px;
                        }

                    #mapContainer, #mapStoreContainer {
                        margin: 0 0 20px;
                        display: block;
                        position: relative;
                    }

                    .search-postcode-wrap {
                        margin: 0;
                        max-height: 40px;
                        display: flex;
                    }

                        .search-wrap {
                            display: flex;
                            flex: 1 0 auto;
                            flex-direction: column;
                        }

                            .search {
                                display: flex;
                            }

                                .search input {
                                    width: 100%;
                                    max-width: 518px;
                                    font-size: 14px;
                                    border: 1px solid #ccc;
                                    color: #797979;
                                    margin: 0 5px 0 0;
                                    padding: 0.7em 0.57em;
                                    /*display: inline-block;
                                    position: relative;
                                    top: -2px;*/
                                    border-radius: 3px;
                                    box-sizing: border-box;
                                }

                            .search-results {
                                display: flex;
                                flex: 1 0 auto;
                            }

                            #droppointSubmit {
                                margin: 0;
                            }

                    .userDroppointStores {
                        height: 100%;
                        color: #797979;
                        margin: 0 0 0 20px;
                    }

                        .userDroppointStores .options {
                            width: 100%;
                            display: flex;
                        }

                    #lastddPostcode, #lastStorePostcode {
                        color: #29a54f;
                        font-size: 12px;
                        font-weight: bold;
                        margin: 5px 0 0;
                        display: block;
                    }

                    paper-toggle-button.droppoint-selection {
                        margin: 1px 0 2px;
                        display: inline-block;
                        --paper-toggle-button-checked-bar-color: #29a54f;
                        --paper-toggle-button-checked-button-color: #29a54f;
                        --paper-toggle-button-checked-ink-color: #29a54f;
                        --paper-toggle-button-unchecked-bar-color: #909090;
                        --paper-toggle-button-unchecked-button-color: #909090;
                        --paper-toggle-button-unchecked-ink-color: #909090;
                    }

                    paper-toggle-button::shadow .toggle-bar {
                        opacity: 1;
                    }

                    .sort-selected {
                        color: var(--black-color);
                        background: var(--droppoint-sort-selected);
                    }

                    .overflow-hidden {
                        background-color: #f8f8f8;
                        padding: 10px 0 0;
                        overflow-x: hidden;
                        overflow-y: auto;
                        border-radius: 0 3px 3px 3px;
                    }

                    #gfsDroppointMap {
                        margin: 20px 0 0;
                    }

                    .hidden-droppoints {
                        min-height: 80px;
                        background-color: #f8f8f8;
                    }

                    #dropPointList {
                        max-height: 500px;
                        margin-bottom: 10px;
                        padding: 10px;

                        display: flex;
                        flex-flow: row wrap;
                        justify-content: space-between;

                        box-sizing: border-box;
                        overflow-x: hidden;
                        overflow-y: auto;
                    }

                        .hide-scroll {
                            margin-right: -18px;
                            /*padding-right: 20px !important;*/ /* needed for actual mobile device */
                            overflow-x: auto;
                        }

                    #go-to-home-droppoint, #go-to-home-store {
                        margin: 0;
                        position: absolute;
                        right: 9px;
                        bottom: 20px;
                        z-index: 1;
                        cursor: pointer;
                    }

                    .view-list.active {
                        color: #29a54f;
                    }
                    .view-map.active {
                        color: var(--gfs-blue-color);
                    }

                    paper-toggle-button.map-to-list {
                        --paper-toggle-button-checked-bar-color:  var(--gfs-blue-color);
                        --paper-toggle-button-checked-button-color:  var(--gfs-blue-color);
                        --paper-toggle-button-checked-ink-color: var(--gfs-blue-color);
                        --paper-toggle-button-unchecked-bar-color:  #29a54f;
                        --paper-toggle-button-unchecked-button-color:  #29a54f;
                        --paper-toggle-button-unchecked-ink-color: #29a54f;
                    }

                    .toggle-bar {
                        opacity: 1
                    }

                    @media (max-width: 812px) {
                        vaadin-tabs span {
                            display: none;
                        }

                        vaadin-tabs[orientation="vertical"] {
                            flex: none;
                        }

                        vaadin-tabs[orientation="horizontal"] vaadin-tab iron-icon {
                            width: 24px;
                            height: 24px;
                        }
                    }

                    @media (max-width: 614px) {
                        .search-postcode-wrap {
                            max-height: 100%;
                            flex-direction: column;
                        }

                        .userDroppointStores {
                            margin: 15px 0 0;
                            display: flex;
                            flex-direction: column;
                        }

                            .userDroppointStores .options {

                            }

                        #gfsDroppointMap {
                            margin: 20px 0 0;
                        }
                    }

                    @media (max-width:586px) {
                        vaadin-tabs[orientation="vertical"] {
                            display: flex;
                            align-items: center;
                        }

                        vaadin-tabs[orientation="vertical"] > [part="tabs"] {
                            display: flex;
                            flex-grow: 1;
                            align-items: stretch;
                            overflow-x: auto;
                        }

                        #dropPointList {
                            width: 100%;
                            height: auto;
                            max-height: 350px;
                            flex-flow: column wrap;
                            overflow-x: scroll;
                        }

                    }
            </style>
        </template>
    </dom-module>`;

// GfsCheckoutStyle.register('gfs-checkout-style');
document.head.appendChild(GfsCheckoutStyle.content);
