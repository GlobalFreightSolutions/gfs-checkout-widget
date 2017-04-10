[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget.svg?branch=master)](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget)


# &lt;gfs-checkout&gt;

The `gfs-checkout` widget provides a rich user interface that interacts with the GFS Checkout service in order to provide a wide range of easily configured delivery options.
If it's place on the same page as the Carrier Information, Selected Drop Point and/or Delivery Address widgets, the Checkout widget will also assume control of them.

## Install

```bash
# via bower
$ bower install --save gfs-checkout-widget
```

## Usage

1. Import Web Components' polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents.js"></script>
```

> Note: we use the full version of webcomponets.js as its needed for the brick-calendar


2. Import Custom Element:

```html
<link rel="import" href="bower_components/gfs-checkout-widget/gfs-checkout-widget.html">
```

3. Start using it!

<!---
```
<custom-element-demo>
    <template>
        <script src="../webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="gfs-checkout-widget.html">
        <next-code-block></next-code-block>
    </template>
</custom-element-demo>
```
-->

```html
<gfs-checkout
    access-token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHRlNfaWRlbnRpdHlfc2VydmVyIiwiYXVkIjoiR0ZTX2lkZW50aXR5X3NlcnZlciIsImV4cCI6MTQ5MTQ5Mjg3NywibmJmIjoxNDkxNDg5Mjc3LCJjbGllbnRfaWQiOiJwcm92aWRlZF9ieV9HRlMiLCJsaXZlLWFwaS1rZXkiOiJwcm92aWRlZF9ieV9HRlMiLCJ0ZXN0LWFwaS1rZXkiOiJwcm92aWRlZF9ieV9HRlMiLCJzY29wZSI6WyJjaGVja291dC1hcGkiLCJyZWFkIl19.Cavb8IrFNq-ZZAqNL1JEGbBtC9tgngyYC2wMPk8TwGs"
    gfs-data="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiQ2VudHVyeSBIb3VzZSwgMTAwIFN0YXRpb24gUm9hZCwgSG9yc2hhbSwgV2VzdCBTdXNzZXgsIFJIMTMgNVVaIiwibmFtZSI6Ikdsb2JhbEZyZWlnaHRTb2x1dGlvbnMiLCJlbWFpbCI6ImRldnN1cHBvcnRAanVzdHNob3V0Z2ZzLmNvbSJ9.uRjj9mLjwbUEHzAUujJFZPd9pT1fZew-E73OWvLxbts"
    initial-address="50 Mill Way, Southampton, SO40 7JF, United Kingdom"
    currency-symbol="&pound;"
    default-delivery="Standard"
    default-service="Standard"
    default-carrier="YODEL"
    default-carrier-code="ECO"
    default-price="2.50"
    default-min-delivery-time="1"
    default-max-delivery-time="5">
</gfs-checkout>
```

More info, demo and all the available properties can be found at [GFS widget portal](http://developer.justshoutgfs.com/info/documentation/gfs-checkout/the-gfs-checkout-widgets/checkout-widget/ "The Checkout Widget")


## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)
