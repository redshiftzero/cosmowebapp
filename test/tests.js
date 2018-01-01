QUnit.test( "smoke test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "verify bounding indices are correct for omega_M = 0.25", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 0.25;
  [lowerindex, upperindex] = determine_bounding_indices(param, param_table);
  assert.equal(lowerindex, 1, "lowerindex is set correctly");
  assert.equal(upperindex, 2, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices are correct for omega_M = 0.1", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 0.1;
  [lowerindex, upperindex] = determine_bounding_indices(param, param_table);
  assert.equal(lowerindex, 0, "lowerindex is set correctly");
  assert.equal(upperindex, 1, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices return nulls if param too large", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = 2.0;
  [lowerindex, upperindex] = determine_bounding_indices(param, param_table);
  assert.equal(lowerindex, null, "lowerindex is set correctly");
  assert.equal(upperindex, null, "upperindex is set correctly");
});

QUnit.test( "verify bounding indices return nulls if param too small", function( assert ) {
  var param_table = [0.1, 0.2, 0.3, 0.4];
  var param = -0.1;
  [lowerindex, upperindex] = determine_bounding_indices(param, param_table);
  assert.equal(lowerindex, null, "lowerindex is set correctly");
  assert.equal(upperindex, null, "upperindex is set correctly");
});

QUnit.test( "verify weights computation correct for test parameter equidistant from two parameters", function( assert ) {
  var param = 0.25;
  var param_lower = 0.2;
  var param_upper = 0.3;
  [weight1, weight2] = compute_weights(param, param_lower, param_upper);
  assert.equal(weight1, 0.5, "weight1 computation correct");
  assert.equal(weight2, 0.5, "weight2 computation correct");
});
