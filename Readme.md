[![Build Status](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget.svg?branch=master)](https://travis-ci.org/GlobalFreightSolutions/gfs-checkout-widget)


# &lt;gfs-checkout&gt;

The `gfs-checkout` widget provides a rich user interface that interacts with the GFS Checkout service in order to provide a wide range of easily configured delivery options. If it's place on the same page as the Carrier Information, Selected Drop Point and/or Delivery Address widgets, the Checkout widget will also assume control of them.

## Install

```bash
# via bower
$ bower install gfs-selected-droppoint
```

## Usage
```html
<link rel="import" href="path_to_bower_components/gfs-checkout-widget/gfs-checkout-widget.html" />
```

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
	initial-address="50 Mill Way, Southampton, SO40 7JF, United Kingdom"
	currency-symbol="&pound;">
</gfs-checkout>
```

More info, demo and all the available properties can be found at [GFS widget portal](http://gfsdeveloperportal.azurewebsites.net/info/documentation/gfs-checkout/the-gfs-checkout-widgets/checkout-widget/ "The Checkout Widget")