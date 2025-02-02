export const paymentSuccessTemplate = (
  transactionId,
  kriyaId,
  name,
  email,
  fee,
  type,
  eventId,
  datetime,
  headerImg = "https://i.ibb.co/DbkTdD5/Pastel-Rainbow-Modern-January-Monthly-Email-Header.png",
  footerImg = "https://i.ibb.co/qknwSd6/Pastel-Rainbow-Modern-January-Monthly-Email-Header-1.png"
) => ` <table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
    <tr>
        <td bgcolor="#f5f5f5" align="center" style="padding: 0px 15px 18px 15px; background-color: #f5f5f5;">
            <table border="0" cellpadding="0" cellspacing="0" width="666" class="responsive-table">
                <tbody>
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td align="center"
                                            style="padding: 18px 0 0 0; border-top: 1px #CFD2D3 solid;">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- HERO IMAGE -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    
                                    <tr style="background: white; margin-top: 2rem;">
                                        <td align="center">
                                            <p
                                                style="font-size: 2rem; font-weight: 600; font-family:'Poppins', sans-serif ; color: black; padding-top: 2rem;">

                                                Payment Successful
                                            </p>
                                        </td>
                                    </tr>
                                    <tr style="background: white; ">
                                        <td
                                            style="padding: 0px 40px 0px 2rem; font-size: 1.1rem; font-family: 'Poppins', sans-serif;">
                                            <b style="font-size: 1.2rem;">
                                                Hey ${name},
                                            </b>
                                            <p>
                                                The transaction has been successfully completed
                                                by the participant ${kriyaId}.
                                            </p>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Name</td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">
                                                            ${name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Email</td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">
                                                            ${email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Amount</td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">Rs
                                                            ${fee}.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Type</td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">
                                                            ${type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Event Id
                                                        </td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">
                                                            ${
                                                              eventId.toString() ===
                                                              "-1"
                                                                ? "Nil"
                                                                : eventId
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; width: 100px;">Datetime
                                                        </td>
                                                        <td style="font-weight: 500; padding-bottom: 4px;">
                                                            ${datetime}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <p>
                                                You may use the screenshot of this mail as a proof of payment.
                                            </p>
                                            <b>Best Wishes,</b><br />
                                            <p style="padding-bottom: 4rem;">

                                                Yutira 2025 Team<br />
                                                PSG College of Technology
                                            </p>

                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
    <tr>
        <td bgcolor="#ffffff" align="center" style="padding:  0;">
            <!-- UNSUBSCRIBE COPY -->
            <table width="666" border="0" cellspacing="0" cellpadding="0" align="center"
                class="responsive-table">
                <tbody>
                    <tr>
                        <td align="center"
                            style="padding: 1rem;    font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">
                            <span class="appleFooter" style="color:#666666;">Civil Engineering Association and ICI - Student's Chapter - PSG College of
                                Technology
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
</tbody>
</table>
`;
