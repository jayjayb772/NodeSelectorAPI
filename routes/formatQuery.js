

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
        +'<style>body {font-size: 150%}</style>'
    + '<html><h1>';
    htmlDoc+=`Your Address: ${addr}`;
    htmlDoc+= '<h1><br><body>';
    htmlDoc+= `Closest Node: ${query["NEIGHBORHOOD_ID"]}<br>`
        + `Node Name: ${query["NODE_NAME"]}<br>`
        + `Primary Contact: ${query["PRIMARY_CONTACT"]}<br>`
        + `Phone number: ${query["PHONE"]}<br>`
        +'</body></html>';
    return htmlDoc;
}