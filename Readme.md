[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget.svg?branch=develop)](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget)


# &lt;gfs-checkout&gt;

The `gfs-checkout` widget provides a rich user interface that interacts with the GFS Checkout service in order to provide a wide range of easily configured delivery options. 
If it's place on the same page as the Carrier Information, Selected Drop Point and/or Delivery Address widgets, the Checkout widget will also assume control of them.

## Install

```bash
# via bower
$ bower install --save gfs-selected-droppoint
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
    access-token=""
    gfs-data=""
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

More info, demo and all the available properties can be found at [GFS widget portal](http://gfsdeveloperportal.azurewebsites.net/info/documentation/gfs-checkout/the-gfs-checkout-widgets/checkout-widget/ "The Checkout Widget")


## License

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)