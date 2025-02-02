export const registrationConfirmTemplate = (
  name,
  kriyaId,
  headerImg = "https://i.ibb.co/129BwTm/header.png",
  footerImg = "https://i.ibb.co/HBc2VWT/footer.png"
) => ` <table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
    <tr>
        <td bgcolor="#f5f5f5" align="center" style="padding: 0px 15px 18px 15px; background:#f7f2e9">
            <table border="0" cellpadding="0" cellspacing="0" width="666" class="responsive-table">
                <tbody>
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td align="center"
                                            style="padding: 18px 0 0 0; border-top: 1px #d3cfd3 solid;">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- HERO IMAGE -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    
                                    <tr style="background:white;margin-top: 2rem;">
                                        <td align="center">
                                            <p
                                                style="font-size: 2rem; font-weight: 600; font-family: 'Poppins', sans-serif; color: black;padding-top: 1rem;">
                                                Thank you for registering!
                                            </p>
                                        </td>
                                    </tr>
                                    <tr style="background:white;">
                                        <td
                                            style=" padding: 0px 40px 0px 2rem; font-size: 1.1rem;  font-family: 'Poppins', sans-serif;color:black;">
                                            <b style=" font-size: 1.2rem;">
                                                Hey ${name},
                                            </b>
                                            <p>
                                                You have successfully registered for Yutira 2025.
                                                We are glad to have you on board.
                                                Your
                                                Yutira ID for the event is
                                            </p>
                                            <p style="font-size: 2rem; color:#332881; font-weight: bold;">
                                                ${kriyaId}
                                            </p>
                                            <p>
                                                Follow our website for the latest updates on exciting events
                                            </p>
                                            <b>Best Wishes,</b>
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
