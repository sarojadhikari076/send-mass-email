export const emailTemplatePdf = `
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vegan Camp Out 2024 Ticket</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        margin: 0;
        padding: 0;
      }

      .wrapper {
        width: 620px;
        margin: 0 auto;
      }

      .inner-wrapper {
        width: 620px;
        background-color: #f7f7f7;
        margin: 0 auto;
        padding: 0;
      }

      .ticket-details h6,
      .ticket-venue h6,
      .ticket-organizer h6 {
        margin: 0 0 10px 0;
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        text-transform: uppercase;
        font-size: 13px;
        color: #909090;
        font-weight: 700;
      }

      .ticket-details span,
      .ticket-venue span,
      .ticket-organizer span {
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-size: 15px;
        color: #0a0a0e;
      }

      h2 {
        display: block;
        color: #0a0a0e;
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 28px;
        text-align: left;
        margin: 0 0 10px 0;
      }

      h4 {
        color: #0a0a0e;
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        text-align: left;
        margin: 0;
        margin-bottom: 20px;
      }

      .whiteSpace {
        height: 16px;
        background: #f7f7f7;
        margin: 0;
      }

      .ticket-footer a {
        font-weight: normal;
        display: block;
        margin-middle: 20px;
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-size: 13px;
        text-decoration: underline;
        color: #006caa;
      }

      .qr-code {
        font-weight: bold;
        text-decoration: none;
        text-transform: capitalize;
        font-size: 14px;
        line-height: 24px;
        border: 0;
        height: auto;
        max-width: 100%;
        display: block;
      }
    </style>
  </head>

  <body>
    <table class="wrapper" align="center" width="620">
      <tr>
        <td align="center" valign="middle" class="wrapper">
          <table class="inner-wrapper" border="0" cellpadding="0" cellspacing="0" width="620" bgcolor="#f7f7f7" align="center">
            <tr>
              <td valign="middle" class="ticket-content" align="left" width="580">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
                  <tr>
                    <td valign="middle" align="center" width="100%">
                      <h2>
                        <a href="https://vegancampouttickets.com/?post_type=tribe_events&p=21798%2F/" style="font-weight: normal; text-decoration: underline; border: 0; color: #0a0a0e;">
                          Vegan Camp Out 2024
                        </a>
                      </h2>
                      <h4>
                        <span class="tribe-event-date-start">July 26 @ 1:00 pm</span> - <span class="tribe-event-date-end">July 29 @ 12:00 pm</span>
                      </h4>
                    </td>
                  </tr>
                </table>
                <div class="whiteSpace"></div>
                <table class="ticket-venue" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
                  <tr>
                    <td class="ticket-venue" valign="middle" align="left" width="300">
                      <h6>Venue</h6>
                      <table class="venue-details" border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
                        <tr>
                          <td class="ticket-venue-child" valign="middle" align="left" width="130">
                            <span>Bicester Heritage</span>
                            <span>
                              Bicester Heritage<br>
                              Oxford, Oxfordshire OX26 5HA
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td class="ticket-organizer" valign="middle" align="left" width="140">
                      <h6>Organiser</h6>
                      <span>VCO</span>
                    </td>
                  </tr>
                </table>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" align="center">
                  <tr>
                    <td class="ticket-footer" valign="middle" align="left" width="100%">
                      <a href="https://vegancampouttickets.com">https://vegancampouttickets.com</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          {{#each data}}
              <table class="inner-wrapper" border="0" cellpadding="0" cellspacing="0" bgcolor="#f7f7f7" align="center">
                <tr>
                  <td valign="middle" class="ticket-content" align="left" width="140" bgcolor="#f7f7f7">
                    <img src="{{this.imageUrl}}" width="140" height="140" alt="{{this.code}}" class="qr-code">
                  </td>
                  <td valign="middle" class="ticket-organizer ticket-content" align="left" bgcolor="#f7f7f7">
                    <h6>Attendee</h6>
                    <span>{{this.attendee}}</span>
                    <br>
                    <span>{{this.type}}</span>
                    <br>
                    <span>{{this.code}}</span>
                  </td>
                </tr>
              </table>
          {{/each}}
        </td>
      </tr>
    </table>
  </body>

</html>
`;
