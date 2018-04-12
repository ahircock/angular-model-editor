async function genModelDetailsDiv(model) {
    
    // if they provided a string, then this must be the model-id. Get the object
    if ( typeof model == "string" ) {
        var modelId = model;
         model = await getModelById( modelId );
    }

    // create the model-box
    var modelDiv = document.createElement("div");
    modelDiv.className = "modelBox";

    // add the title box
    var titleDiv =genTitleBoxDiv(model);
    modelDiv.appendChild(titleDiv);

    // add the special rules box
    if ( model.specialRules.length > 0 ) {
        var statsDiv = genSpecialRulesBoxDiv(model);
        modelDiv.appendChild(statsDiv);
    }

    // add the action bar boxes
    for ( i=0; i<model.actions.length; i++ ) {
        var actionBoxDiv = genActionBoxDiv(model.actions[i]);
        actionBoxDiv.id = "action" + (i+1);
        modelDiv.appendChild(actionBoxDiv);
    }
    
    return modelDiv;
}

function genTitleBoxDiv( model ) {

    // create the title box DIV
    var titleBox = document.createElement("div");
    titleBox.className = "titleBox";
    
    // create the model image box DIV
    var modelImageBox = document.createElement("div");
    modelImageBox.className = "modelImageBox";
    
    // create the model image
    var modelImage = document.createElement("img");
    modelImage.className = "modelImage";
    if ( typeof(model.picture) == "undefined" ) {
        modelImage.src = "images/portraits/basic.jpg";
    } else {
        modelImage.src = "images/portraits/" + model.picture;
    }
    
    // create the model text box DIV
    var modelTextBox = document.createElement("div");
    modelTextBox.className = "modelTextBox";
    
    // add the name
    var modelName = document.createElement("div");
    modelName.innerHTML = model.name;
    modelName.className = "modelName";
    
    // add the type
    var modelType = document.createElement("div");
    modelType.innerHTML = model.traits;
    modelType.className = "modelType";
    
    // add the cost
    var modelCost = document.createElement("div");
    modelCost.className = "modelCost";
    modelCost.innerHTML = model.cost + " points";

    // add the boxes
    modelImageBox.appendChild(modelImage);
    modelTextBox.appendChild(modelName);
    modelTextBox.appendChild(modelType);
    modelTextBox.appendChild(modelCost);
    
    // add the stats table
    var statTable = genStatTable( model );
    modelTextBox.appendChild( statTable );
    
    titleBox.appendChild(modelTextBox);
    titleBox.appendChild(modelImageBox);
    
    // return the DIV
    return titleBox;
    
}
function genSpecialRulesBoxDiv( model ) {
    
    // *** SPECIAL RULES BOX ***
    // add a special rules box
    var specialRulesBox = document.createElement("div");
    specialRulesBox.className = "specialRulesBox";
    for ( i=0; i<model.specialRules.length; i++ ) {
        var ruleDiv = document.createElement("div");
        ruleDiv.innerHTML = "<b>" + model.specialRules[i].ruleName + "</b> - " + model.specialRules[i].ruleText;
        ruleDiv.className = "specialRule";
        specialRulesBox.appendChild(ruleDiv);
    }

    // return the stats box DIV
    return specialRulesBox;
}

function genActionBoxDiv( action ) {

    var actionDiv;
    if ( action.type == "MELEE" || action.type == "RANGED" ) {
        actionDiv = genAttackActionDiv(action);
    } else {
        actionDiv = genSpecialActionDiv(action);
    }
    return actionDiv;
}
    
function genAttackActionDiv( action ) {

    // create a div to hold the entire attack action
    var actionBox = document.createElement("div");

    // add the title
    var actionTitle = genActionTitleDiv( action );
    actionBox.appendChild(actionTitle);

    // add the action stat bar
    var actionStatBar = document.createElement("div");
    actionStatBar.className = "attackActionStatBar";
    actionBox.appendChild(actionStatBar);

    // add action icon
    var actionIconDiv = document.createElement("div");
    actionIconDiv.className = "attackActionIconDiv";
    actionStatBar.appendChild(actionIconDiv);
    var actionIcon = document.createElement("img");
    actionIcon.className = "attackActionIcon";
    switch ( action.type ) {
        case "MELEE":
            actionIcon.src = "images/icon-sword-invert.png"
            break;
        case "RANGED":
            actionIcon.src = "images/icon-bow-invert.png"
            break;
    }
    actionIconDiv.appendChild(actionIcon);

    // add the action stats table
    var actionTableDiv = document.createElement("div");
    actionTableDiv.className = "attackActionTableDiv";
    actionStatBar.appendChild(actionTableDiv);
    var actionTable = document.createElement("table");
    actionTable.className = "attackActionTable";
    actionTableDiv.appendChild(actionTable);

    // add action stats table header row
    var actionTableHeaderRow = document.createElement("tr");
    actionTableHeaderRow.className = "statHeader";
    actionTable.appendChild(actionTableHeaderRow);

    var headerRNG = document.createElement("th");
    headerRNG.innerHTML = "RNG";
    actionTableHeaderRow.appendChild(headerRNG);
    var headerHIT = document.createElement("th");
    headerHIT.innerHTML = "HIT";
    actionTableHeaderRow.appendChild(headerHIT);
    var headerDMG = document.createElement("th");
    headerDMG.innerHTML = "DMG";
    actionTableHeaderRow.appendChild(headerDMG);

    // add action stats table data row
    var actionTableDataRow = document.createElement("tr");
    actionTableDataRow.className = "statData";
    actionTable.appendChild(actionTableDataRow);

    var dataRNG = document.createElement("td");
    dataRNG.innerHTML = action.RNG;
    actionTableDataRow.appendChild(dataRNG);
    var dataHIT = document.createElement("td");
    dataHIT.innerHTML = action.HIT;
    actionTableDataRow.appendChild(dataHIT);
    var dataDMG = document.createElement("td");
    dataDMG.innerHTML = action.DMG;
    actionTableDataRow.appendChild(dataDMG);

    // add action special rules
    if ( action.specialRules.length > 0 ) {

        // add a special rules box
        actionStatBar.style.borderBottomStyle = "none";
        var actionSpecialRulesBox = document.createElement("div");
        actionSpecialRulesBox.className = "attackActionSpecialRulesBox";
        actionBox.appendChild(actionSpecialRulesBox);

        for ( j=0; j<action.specialRules.length; j++ ) {
            var ruleDiv = document.createElement("div");
            ruleDiv.innerHTML = "<b>" + action.specialRules[j].ruleName + "</b> - " + action.specialRules[j].ruleText;
            ruleDiv.className = "specialRule";
            actionSpecialRulesBox.appendChild(ruleDiv);
        }
    }

    // return the new action box DIV
    return actionBox;
}
    
function genSpecialActionDiv( action ) {

    // create a div to hold the entire attack action
    var actionBox = document.createElement("div");

    // add the title
    var actionTitle = genActionTitleDiv( action );
    actionBox.appendChild(actionTitle);

    // add action special rules
    if ( action.specialRules.length > 0 ) {

        // add a special rules box
        var actionSpecialRulesBox = document.createElement("div");
        actionSpecialRulesBox.className = "specialActionRulesBox";
        actionSpecialRulesBox.style.borderTopStyle = "none";
        actionBox.appendChild(actionSpecialRulesBox);

        // add the icon div
        var actionIconDiv = document.createElement("div");
        actionIconDiv.className = "specialActionIconDiv";
        actionSpecialRulesBox.appendChild(actionIconDiv);

        // add the icon
        var actionIcon = document.createElement("img");
        actionIcon.className = "specialActionIcon";
        switch ( action.type ) {
            case "SPECIAL":
                actionIcon.src = "images/icon-star-invert.png"
                break;
        }
        actionIconDiv.appendChild(actionIcon);

        // add the special rules
        var ruleDiv = document.createElement("div");
        ruleDiv.innerHTML = "<b>" + action.specialRules[0].ruleName + "</b> - " + action.specialRules[0].ruleText;
        ruleDiv.className = "specialActionRule";
        actionSpecialRulesBox.appendChild(ruleDiv);
    }
    
    // return the new action box DIV
    return actionBox;
}

function genActionTitleDiv( action ) {
    
    // add the action title
    var actionTitleBox = document.createElement("div");
    actionTitleBox.className = "actionTitleBox";
    
    var actionTitle = document.createElement("div");
    actionTitle.className = "actionTitle";
    actionTitle.innerHTML = action.name;
    
    var actionAPCost = document.createElement("div");
    actionAPCost.className = "actionAPCost";
    if ( !action.ONCE ) { 
        actionAPCost.innerHTML = action.AP;
    } else {
        actionAPCost.innerHTML = action.AP + " - ONCE";
        
    }
    
    var actionTraits = document.createElement("div");
    actionTraits.className = "actionTraits";
    if ( action.traits != null ) { 
        actionTraits.innerHTML = action.traits;
    }
    
    // put them all together
    actionTitleBox.appendChild(actionAPCost);
    actionTitleBox.appendChild(actionTitle);
    actionTitleBox.appendChild(actionTraits);

    // return the DIV
    return actionTitleBox;
    
}

function genStatTable( model ) {

    // create the stat table
    var statTable = document.createElement("table");
    statTable.className = "statTable";
    
    // create the stat table header
    var statHeaderRow = document.createElement("tr");
    statHeaderRow.className = "statHeader";
    statTable.appendChild(statHeaderRow);
    var statHeaderSPD = document.createElement("th");
    statHeaderSPD.innerHTML = "SPD";
    statHeaderRow.appendChild(statHeaderSPD);
    var statHeaderEV = document.createElement("th");
    statHeaderEV.innerHTML = "EV";
    statHeaderRow.appendChild(statHeaderEV);
    var statHeaderARM = document.createElement("th");
    statHeaderARM.innerHTML = "ARM";
    statHeaderRow.appendChild(statHeaderARM);
    var statHeaderHP = document.createElement("th");
    statHeaderHP.innerHTML = "HP";
    statHeaderRow.appendChild(statHeaderHP);
    
    // create the stat table data
    var statDataRow = document.createElement("tr");
    statDataRow.className = "statData";
    statTable.appendChild(statDataRow);
    var statDataSPD = document.createElement("td");
    statDataSPD.innerHTML = model.SPD;
    statDataRow.appendChild(statDataSPD);
    var statDataEV = document.createElement("td");
    statDataEV.innerHTML = model.EV;
    statDataRow.appendChild(statDataEV);
    var statDataARM = document.createElement("td");
    statDataARM.innerHTML = model.ARM;
    statDataRow.appendChild(statDataARM);
    var statDataHP = document.createElement("td");
    statDataHP.innerHTML = model.HP;
    statDataRow.appendChild(statDataHP);

    // return the generated table
    return statTable;
}
