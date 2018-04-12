// *** NOTE: You will need to load the external utils.js file before loading this file

async function getModelSearch(searchString) {
    var url = "model/search?searchString=" + searchString;
    var modelList = await callRestAPI( "GET", url );
    return modelList;
}

async function getModelById(modelId, provideRuleText) {
    var url = "model/getbyid?id=" + modelId;
    if ( typeof(provideRuleText) != "undefined" && provideRuleText == false ) {
        url = url + "&provideRuleText=NO";
    }
    var model = await callRestAPI( "GET", url );
    return model;
}

async function addModel(newModel) {
    var url = "model/add";
    var response = await callRestAPI( "POST", url, newModel );
    return response.newModelId;
}

async function updateModel(modelId, editModel) {
    var url = "model/update?id=" + modelId;
    var response = await callRestAPI( "POST", url, editModel );
    return response.editModelId;
}

async function deleteModel(modelId) {
    var url = "model/delete?id=" + modelId;
    var response = await callRestAPI( "POST", url );
    return response.deleteModelId;
}

async function getSpecialRuleSearch(searchString) {
    var url = "specialrule/search?searchString=" + searchString;
    var specialRuleList = await callRestAPI( "GET", url );
    return specialRuleList;
}

async function getSpecialRuleById(specialRuleId) {
    var url = "specialrule/getbyid?id=" + specialRuleId;
    var specialRule = await callRestAPI( "GET", url );
    return specialRule;
}

async function addSpecialRule(newRule) {
    var url = "specialrule/add";
    var response = await callRestAPI( "POST", url, newRule );
    return response.newSpecialRuleId;
}

async function updateSpecialRule(specialRuleId, editSpecialRule) {
    var url = "specialrule/update?id=" + specialRuleId;
    var response = await callRestAPI( "POST", url, editSpecialRule );
    return response.editSpecialRuleId;
}

async function deleteSpecialRule(specialRuleId) {
    var url = "specialrule/delete?id=" + specialRuleId;
    var response = await callRestAPI( "POST", url );
    return response.deleteSpecialRuleId;
}