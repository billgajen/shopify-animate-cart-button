const { TUNNEL_URL } = process.env;

async function updateScriptTag (ctx, next) {

  const scriptTagBody =  JSON.stringify({
      script_tag: {
        event: 'onload',
      },
  });
  const scriptTagHeaders = {
    'X-Shopify-Access-Token': ctx.session.accessToken,
    'Content-Type': 'application/json',
    'Accept': '*/*'
  };
  const addScriptTagOptions = {
    method: 'GET',
    credentials: 'include',
    body: scriptTagBody,
    headers: scriptTagHeaders,
    json: true
  };

  const responseJSON = fetch(`https://${ctx.session.shop}/admin/script_tags.json`, addScriptTagOptions)
    .then((response) => response.json())
    .then((jsonData) =>{ 
      return jsonData
    })
    .catch((error) => console.log('error', error));

  ctx.body = await responseJSON;
  ctx.type = "application/json";

};
module.exports = updateScriptTag;