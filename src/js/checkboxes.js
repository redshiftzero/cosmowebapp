var checkBox = document.getElementById("fix-omegamh2-checkbox");

checkBox.onclick = function() {
    fix_omegamh2 = checkBox.checked;
    console.log("fix omegamh2 = ", fix_omegamh2);
    run_pk_display();
}
