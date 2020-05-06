

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
    + '<html><div style="text-align: center"><h5>';
    htmlDoc+=`Your Address: ${addr}`;
    htmlDoc+= '</h5><br><h3><body>';
    htmlDoc+= `Closest Node: ${query["NEIGHBORHOOD_ID"]}<br>`
        + `Node Name: ${query["NODE_NAME"]}<br>`
        + `Primary Contact: ${query["PRIMARY_CONTACT"]}<br>`
        + `Phone number: ${query["PHONE"]}<br>`
        + `Email:<a href="mailto:${query["EMAIL"]}">${query["EMAIL"]}</a><br>`
        +'</body></h3></div></html>';
    return htmlDoc;
}