[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget.svg?branch=master)](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget)


The `gfs-checkout` widget provides a rich user interface that interacts with the GFS Checkout service in order to provide a wide range of easily configured delivery options.
If it's place on the same page as the Carrier Information, Selected Drop Point and/or Delivery Address widgets, the Checkout widget will also assume control of them.


## Usage

### Install

```bash
$ npm i --save gfs-checkout
```

In your checkout page, include the below google map API.

```html
    <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyAMQhcXM06TZBHZ95LwJBRVGSV4CqUQMpI&libraries=places"></script>
```

### Import In a HTML file:

```html
<html>
    <head>
        <script type="module">
            import '@gfsdeliver/gfs-checkout/gfs-checkout.js';
        </script>
    </head>
    <body>
        <gfs-checkout use-standard use-calendar use-droppoints use-droppoints-stores
                    checkout-results="gfsCheckoutResult" sessionid="gfsSessionID" checkout-data="gfsCheckoutData"
                    default-delivery-method="[[defaultDeliveryMethod]]"
                    initial-address="100 Station Road, Horsham, RH13 5UZ, United Kingdom"
                    currency-symbol="&pound;"
                    checkout-token="ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKSFJsTmZhV1JsYm5ScGRIbGZjMlZ5ZG1WeUlpd2lZWFZrSWpvaVIwWlRYMmxrWlc1MGFYUjVYM05sY25abGNpSXNJbVY0Y0NJNk1UUTVNVFE1TWpnM055d2libUptSWpveE5Ea3hORGc1TWpjM0xDSmpiR2xsYm5SZmFXUWlPaUp3Y205MmFXUmxaRjlpZVY5SFJsTWlMQ0pzYVhabExXRndhUzFyWlhraU9pSndjbTkyYVdSbFpGOWllVjlIUmxNaUxDSjBaWE4wTFdGd2FTMXJaWGtpT2lKd2NtOTJhV1JsWkY5aWVWOUhSbE1pTENKelkyOXdaU0k2V3lKamFHVmphMjkxZEMxaGNHa2lMQ0p5WldGa0lsMTkuQ2F2YjhJckZOcS1aWkFxTkwxSkVHYkJ0Qzl0Z25neVlDMndNUGs4VHdHcw=="
                    checkout-request="eyJvcHRpb25zIjp7InN0YXJ0RGF0ZSI6IjIwMTktMDctMTciLCJlbmREYXRlIjoiMjAyMC0wMS0xMiIsImN1cnJlbmN5IjoiR0JQIiwiZHJvcHBvaW50cyI6eyJtYXgiOjUwLCJyYWRpdXMiOjUwMDAwfSwic3RvcmVzIjp7Im1heCI6MzAsInJhZGl1cyI6MzAwMDB9fSwib3JkZXIiOnsiZGVsaXZlcnkiOnsib3JpZ2luIjp7InN0cmVldCI6Ik5vcnRoY29kZSIsImNpdHkiOiJMb25kb24iLCJ6aXAiOiJFWDEyIDNMVCIsImNvdW50cnkiOiJHQiJ9LCJkZXN0aW5hdGlvbiI6eyJzdHJlZXQiOiIxMDAgU3RhdGlvbiBSb2FkIiwiY2l0eSI6IkhvcnNoYW0iLCJ6aXAiOiJSSDEzIDVVWiIsImNvdW50cnkiOiJHQiJ9fSwicHJpY2UiOjQ1Ljk5LCJpdGVtcyI6W3siUXVhbnRpdHkiOjEsIkRlc2NyaXB0aW9uIjoiQmx1ZSBQYXJ0eSBTaG9lcyIsIlByb2R1Y3RDb2RlIjoxMCwiUHJpY2UiOjQ1Ljk5fV19fQ=="
                    show-opening-hours="true"
                    show-distance="true"
                    is-standard-button="true"
                    droppoint-sort-list="distance"
                    allow-calendar-preselect
                    show-calendar-no-services
                    allow-preselect-service
                    tax-and-duty-type="charge"
                    tax-and-duty="10"
                    default-description="Standard Delivery"
                    default-carrier="YODEL"
                    default-price='[{"currency": "GBP", "price": 2.22}]'
                    default-min-delivery-time="3"
                    default-max-delivery-time="6">
        </gfs-checkout>
    </body>
</html>
```

### In a Polymer 3 element
```js
import { PolymerElement, html } from '@polymer/polymer';
import '@gfsdeliver/gfs-checkout/gfs-checkout.js';

class CustomElement extends PolymerElement {
    static get template() {
        return html`
            <gfs-checkout use-standard use-calendar use-droppoints use-droppoints-stores
                    checkout-results="gfsCheckoutResult" sessionid="gfsSessionID" checkout-data="gfsCheckoutData"
                    default-delivery-method="[[defaultDeliveryMethod]]"
                    initial-address="100 Station Road, Horsham, RH13 5UZ, United Kingdom"
                    currency-symbol="&pound;"
                    checkout-token="ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKSFJsTmZhV1JsYm5ScGRIbGZjMlZ5ZG1WeUlpd2lZWFZrSWpvaVIwWlRYMmxrWlc1MGFYUjVYM05sY25abGNpSXNJbVY0Y0NJNk1UUTVNVFE1TWpnM055d2libUptSWpveE5Ea3hORGc1TWpjM0xDSmpiR2xsYm5SZmFXUWlPaUp3Y205MmFXUmxaRjlpZVY5SFJsTWlMQ0pzYVhabExXRndhUzFyWlhraU9pSndjbTkyYVdSbFpGOWllVjlIUmxNaUxDSjBaWE4wTFdGd2FTMXJaWGtpT2lKd2NtOTJhV1JsWkY5aWVWOUhSbE1pTENKelkyOXdaU0k2V3lKamFHVmphMjkxZEMxaGNHa2lMQ0p5WldGa0lsMTkuQ2F2YjhJckZOcS1aWkFxTkwxSkVHYkJ0Qzl0Z25neVlDMndNUGs4VHdHcw=="
                    checkout-request="eyJvcHRpb25zIjp7InN0YXJ0RGF0ZSI6IjIwMTktMDctMTciLCJlbmREYXRlIjoiMjAyMC0wMS0xMiIsImN1cnJlbmN5IjoiR0JQIiwiZHJvcHBvaW50cyI6eyJtYXgiOjUwLCJyYWRpdXMiOjUwMDAwfSwic3RvcmVzIjp7Im1heCI6MzAsInJhZGl1cyI6MzAwMDB9fSwib3JkZXIiOnsiZGVsaXZlcnkiOnsib3JpZ2luIjp7InN0cmVldCI6Ik5vcnRoY29kZSIsImNpdHkiOiJMb25kb24iLCJ6aXAiOiJFWDEyIDNMVCIsImNvdW50cnkiOiJHQiJ9LCJkZXN0aW5hdGlvbiI6eyJzdHJlZXQiOiIxMDAgU3RhdGlvbiBSb2FkIiwiY2l0eSI6IkhvcnNoYW0iLCJ6aXAiOiJSSDEzIDVVWiIsImNvdW50cnkiOiJHQiJ9fSwicHJpY2UiOjQ1Ljk5LCJpdGVtcyI6W3siUXVhbnRpdHkiOjEsIkRlc2NyaXB0aW9uIjoiQmx1ZSBQYXJ0eSBTaG9lcyIsIlByb2R1Y3RDb2RlIjoxMCwiUHJpY2UiOjQ1Ljk5fV19fQ=="
                    show-opening-hours="true"
                    show-distance="true"
                    is-standard-button="true"
                    droppoint-sort-list="distance"
                    allow-calendar-preselect
                    show-calendar-no-services
                    allow-preselect-service
                    tax-and-duty-type="charge"
                    tax-and-duty="10"
                    default-description="Standard Delivery"
                    default-carrier="YODEL"
                    default-price='[{"currency": "GBP", "price": 2.22}]'
                    default-min-delivery-time="3"
                    default-max-delivery-time="6">
            </gfs-checkout>
        `;
    }
}
customElements.define('custom-element', CustomElement);
```

More info, demo and all the available properties can be found at [GFS widget portal](http://developer.justshoutgfs.com/info/documentation/gfs-checkout/the-gfs-checkout-widgets/checkout-widget/ "The Checkout Widget")

## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
