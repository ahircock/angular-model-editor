function bodyOnLoad() {
    // figure out which search to start with
    var searchType = getQueryParameterByName("searchType");
    if ( searchType == "rules" ) {
        ruleSearchButtonOnClick();
    } else {
        modelSearchButtonOnClick();
    }
}

function modelSearchButtonOnClick() {
    document.getElementById("modelSearchButton").disabled = true;
    document.getElementById("ruleSearchButton").disabled = false;
    document.getElementById("ruleResults").style.display = "none";
    document.getElementById("modelResults").style.display = "block";
    loadModelTable();
    document.getElementById("searchInput").focus();
}

function ruleSearchButtonOnClick() {
    document.getElementById("modelSearchButton").disabled = false;
    document.getElementById("ruleSearchButton").disabled = true;
    document.getElementById("modelResults").style.display = "none";
    document.getElementById("ruleResults").style.display = "block";
    loadRuleTable();
    document.getElementById("searchInput").focus();
}

function newModelOnClick() {
    window.location = "./modelEditor.html";
}

function editModelOnClick(srcElement) {
    var modelId = srcElement.id.slice(10);
    window.location = "./modelEditor.html?editId=" + modelId;
}

function cloneModelOnClick(srcElement) {
    var modelId = srcElement.id.slice(11);
    window.location = "./modelEditor.html?cloneId=" + modelId;
}

async function deleteModelOnClick(srcElement) {
    var modelId = srcElement.id.slice(12);
    srcElement.id = "DELETE"; // mark this row as about to be deleted

    try {
        await deleteModel(modelId);
    } catch(err) {
        displayError(err);
    }

    loadModelTable();
}

function addModelToListOnClick(srcElement) {
    
    // create a new row for the force list
    var newDiv = document.createElement("div");
    newDiv.modelId = srcElement.modelId;
    
    // add a button to remove this item
    var removeModelButton = document.createElement("button");
    removeModelButton.type = "button";
    removeModelButton.innerHTML = "-";
    removeModelButton.addEventListener("click", function( eventObject ) { removeModelFromListOnClick(eventObject.srcElement); } );
    
    // add some text to the row
    var modelNameDiv = document.createElement("div");
    modelNameDiv.innerHTML = srcElement.modelName + " (" + srcElement.modelCost + " points)";
    modelNameDiv.style = "display:inline-block";
    
    // prepare the DIV
    newDiv.appendChild(removeModelButton);
    newDiv.appendChild(modelNameDiv);
    
    // add the div to the modelList area
    document.getElementById("modelList").appendChild(newDiv);
}

function removeModelFromListOnClick(srcElement) {
    var rowDiv = srcElement.parentElement;
    var parent = rowDiv.parentElement;
    parent.removeChild(rowDiv);
}

function addSpecialRuleOnClick() {
    window.location = "./specialRuleEditor.html";
}


function searchInputOnSearch() {

    // figure out which table is being shown, then load it
    if ( document.getElementById("modelSearchButton").disabled == false ) {
        loadRuleTable();
    } else {
        loadModelTable();
    }
}

function printModelsButtonOnClick() {
    
    // get the list of modelIds in the list
    var modelIds = [];
    var modelList = document.getElementById("modelList");
    for ( var i=0; i<modelList.children.length; i++ ) {
        modelIds[i] = modelList.children[i].modelId;
    }
    
    // open the print page
    window.open("./printModels.html?modelIds=" + modelIds.join(), "_blank");
}

function clearModelsButtonOnClick() {
    document.getElementById("modelList").innerHTML = "";
}

async function modelRowOnClick(srcElement) {

    // if this row has been flagged for deletion, then don't highlight it
    if ( srcElement.id == "DELETE" ) {
        return;
    }

    // get the model-ID; this will be stored as an attribute of the TR element
    var tr = srcElement;
    while ( tr.tagName != "TR" ) {
        tr = tr.parentElement;
    }
    var modelId = tr.id.slice(9);

    // display the model details in the panel on the page
    await displayModel( modelId );

    // unhighligh  the currently selected row, and then highlight the clicked row
    if ( document.getElementById("modelTable").selectedRow != null ) {
        document.getElementById("modelTable").selectedRow.style.backgroundColor = "White";
    }
    tr.style.backgroundColor = "LightGrey";
    document.getElementById("modelTable").selectedRow = tr;
}

async function displayModel( modelId ) {

    // generate a DIV element that contains the Model Box for the given modelId
    try {
        var modelObject = await getModelById( modelId );
        var modelDiv = await genModelDetailsDiv( modelObject );
    } catch(err) {
        displayError(err);
    }

    // clear the rightColumn and then display the new Model DIV there
    document.getElementById("modelDisplay").innerHTML = "";
    document.getElementById("modelDisplay").appendChild(modelDiv);

}

async function loadRuleTable() {

    try {
        var searchString = document.getElementById("searchInput").value;
        var response = await getSpecialRuleSearch( searchString );
    } catch (err) {
        displayError(err);
    }

    // clear the table
    var table = document.getElementById("ruleTable");
    while ( table.rows.length > 1 ) {
        table.deleteRow(1);
    }

    // insert rows into the table for each result
    for ( i=0; i < response.length; i++ ) {

        var tr = document.createElement("tr");
        tr.className = "searchTableData";

        var tdButtons = document.createElement("td");
        var buttonEdit = document.createElement("button");
        var buttonDelete = document.createElement("button");
        buttonEdit.innerHTML = "Edit";
        buttonEdit.type = "button";
        buttonDelete.innerHTML = "Del";
        buttonDelete.type = "button";
        tdButtons.appendChild(buttonEdit);
        tdButtons.appendChild(buttonDelete);

        var tdName = document.createElement("td");
        tdName.innerHTML = response[i].ruleName;

        var tdText = document.createElement("td");
        tdText.innerHTML = response[i].ruleText;

        var tdId = document.createElement("td");
        tdId.innerHTML = response[i]._id;

        // add all of the table data cells
        tr.appendChild(tdButtons);
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdText);
        table.appendChild(tr);
    }

    // clear the model display box
    document.getElementById("rightColumn").innerHTML = "";
}

async function loadModelTable() {

    try {

        var searchString = document.getElementById("searchInput").value;
        var response = await getModelSearch(searchString);

        // clear the table
        var table = document.getElementById("modelTable");
        while ( table.rows.length > 1 ) {
            table.deleteRow(1);
        }

        // create a new attribute on the table, that will store the selected row
        var attribute = document.createAttribute("selectedRow");
        attribute.value = null;
        table.setAttributeNode(attribute);

        // insert rows into the table for each result
        for ( i=0; i < response.length; i++ ) {

            var tr = document.createElement("tr");
            tr.id = "modelRow-" + response[i]._id;
            tr.className = "searchTableData";
            tr.addEventListener("click", function( eventObject ) { modelRowOnClick(eventObject.srcElement); } );

            // create an add button
            var buttonAdd = document.createElement("button");
            buttonAdd.modelId = response[i]._id;
            buttonAdd.modelCost = response[i].cost;
            buttonAdd.modelName = response[i].name;
            buttonAdd.innerHTML = "+";
            buttonAdd.type = "button";
            buttonAdd.addEventListener("click", function( eventObject ) { addModelToListOnClick(eventObject.srcElement); } );

            // create an edit button
            var buttonEdit = document.createElement("button");
            buttonEdit.id = "editModel-" + response[i]._id;
            buttonEdit.innerHTML = "Edit";
            buttonEdit.type = "button";
            buttonEdit.addEventListener("click", function( eventObject ) { editModelOnClick(eventObject.srcElement); } );

            // create a duplicate button
            var buttonClone = document.createElement("button");
            buttonClone.id = "cloneModel-" + response[i]._id;
            buttonClone.innerHTML = "Clone";
            buttonClone.type = "button";
            buttonClone.addEventListener("click", function( eventObject ) { cloneModelOnClick(eventObject.srcElement); } );

            // create a delete button
            var buttonDelete = document.createElement("button");
            buttonDelete.id = "deleteModel-" + response[i]._id;
            buttonDelete.innerHTML = "Del";
            buttonDelete.type = "button";
            buttonDelete.addEventListener("click", function( eventObject ) { deleteModelOnClick(eventObject.srcElement); } );

            var tdButtons = document.createElement("td");
            tdButtons.appendChild(buttonAdd);
            tdButtons.appendChild(buttonEdit);
            tdButtons.appendChild(buttonClone);
            tdButtons.appendChild(buttonDelete);

            var tdCost = document.createElement("td");
            tdCost.innerHTML = response[i].cost;

            var tdName = document.createElement("td");
            tdName.innerHTML = response[i].name + " (" + response[i]._id + ")";

            // add the table cells
            tr.appendChild(tdButtons);
            tr.appendChild(tdCost);
            tr.appendChild(tdName);
            table.appendChild(tr);

            // if this is the first row, then select it
            if ( i == 0 ) {
                modelRowOnClick(tr);
            }
        }

    } catch(err) {
        displayError(err);
    }
}

function displayError(error) {
    document.getElementById("outputText").innerHTML = error.toString();
    outputDialog = document.getElementById("outputDialog");
    outputDialog.showModal();
}
