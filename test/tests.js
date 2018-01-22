QUnit.test( "smoke test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "verify bounding indices are correct for omega_M = 0.25", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 0.25;
  var lowerindex, upperindex = 0;
  results_arr = determine_bounding_indices(param, param_table);
  var lowerindex = results_arr[0];
  var upperindex = results_arr[1];
  assert.equal(lowerindex, 1, "lowerindex is set correctly");
  assert.equal(upperindex, 2, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices are correct for omega_M = 0.1", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 0.1;
  results_arr = determine_bounding_indices(param, param_table);
  var lowerindex = results_arr[0];
  var upperindex = results_arr[1];
  assert.equal(lowerindex, 0, "lowerindex is set correctly");
  assert.equal(upperindex, 1, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices return nulls if param too large", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 2.0;
  results_arr = determine_bounding_indices(param, param_table);
  var lowerindex = results_arr[0];
  var upperindex = results_arr[1];
  assert.equal(lowerindex, null, "lowerindex is set correctly");
  assert.equal(upperindex, null, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices return nulls if param too small", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = -0.1;
  results_arr = determine_bounding_indices(param, param_table);
  var lowerindex = results_arr[0];
  var upperindex = results_arr[1];
  assert.equal(lowerindex, null, "lowerindex is set correctly");
  assert.equal(upperindex, null, "upperindex is set correctly");
});

QUnit.test( "verify weights computation correct for test parameter equidistant from two parameters", function( assert ) {
  var param = 0.25;
  var param_lower = 0.2;
  var param_upper = 0.3;
  results_arr = compute_weights(param, param_lower, param_upper);
  var weight1 = results_arr[0]
  var weight2 = results_arr[1]
  assert.equal(weight1, 0.5, "weight1 computation correct");
  assert.equal(weight2, 0.5, "weight2 computation correct");
});

QUnit.test( "verify interpolation correct for test parameter equidistant from two parameters", function( assert ) {
  var weight1 = 0.5;
  var weight2 = 0.5;
  var func_table_lower = [1, 2, 3, 4];
  var func_table_upper = [3, 4, 5, 6];
  output_array = interpolate_between_two_lines(weight1, weight2, func_table_lower, func_table_upper);
  expected_array = [2, 3, 4, 5];
  assert.deepEqual(output_array, expected_array, "interpolation correct");
});
