

exports.formatQueryReturnHTML = function(query, res, addr){
    console.log();
    let html = buildHtml(JSON.parse(query), addr);



    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': html.length,
        'Expires': new Date().toUTCString()
    });
    res.end(html);
};

exports.formatMultipleElements = function(queries, res){

};

function buildHtml(query, addr){
    let htmlDoc = '<!DOCTYPE html>'
    + '<html><h3>';
    htmlDoc+=`Your Address: ${addr}`;
    htmlDoc+= '</h3><br><body>';
    htmlDoc+= `Closest Node: ${query["NEIGHBORHOOD_ID"]}<br>`
        + `Node Name: ${query["NODE_NAME"]}<br>`
        + `Primary Contact: ${query["PRIMARY_CONTACT"]}<br>`
        + `Phone number: ${query["PHONE"]}<br>`
        + `Email:<a href="${query["EMAIL"]}">${query["EMAIL"]}</a><br>`
        +'</body></html>';
    return htmlDoc;
}