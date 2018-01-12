var slider = document.getElementById("omega-m-slider");
var sliderValue = document.getElementById("omega-m-range-value");

slider.oninput = function() {
  var currentValue = this.value;
  sliderValue.innerHTML = parseFloat(currentValue).toFixed(2);
    paramValue = currentValue;
    paramName = "Om";
    run_interpolation();
}
