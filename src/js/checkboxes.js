var fixomh2_checkBox = document.getElementById("fix-omegamh2-checkbox");
//var fixflat_checkBox = document.getElementById("fix-flatness-checkbox");

fixomh2_checkBox.onclick = function() {
  fix_omegamh2 = fixomh2_checkBox.checked;
  console.log("fix omegamh2 = ", fix_omegamh2);
  run_pk_display();
}

//fixflat_checkBox.onclick = function() {
//    fix_flat = fixflat_checkBox.checked;
//    console.log("fix omegamh2 = ", fix_omegamh2);
//    run_pk_display();
//}
