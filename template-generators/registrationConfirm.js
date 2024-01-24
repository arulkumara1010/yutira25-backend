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
                                    <tr>
                                        <td>
                                            <a href="" target="_blank">

                                                <img src="https://i.ibb.co/129BwTm/header.png" width="666"
                                                    border="0" alt="Kriya 2024 Registration Cover"
                                                    style="display: block; color: #666666;  font-family: Helvetica, arial, sans-serif; font-size: 16px;"
                                                    class="img-max">



                                            </a>
                                            <!-- src="https://i.ibb.co/qknwSd6/Pastel-Rainbow-Modern-January-Monthly-Email-Header-1.png" -->

                                        </td>
                                    </tr>
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
                                                You have successfully registered for Kriya 2024.
                                                We are glad to have you on board.
                                                Your
                                                Kriya ID for the event is
                                            </p>
                                            <p style="font-size: 2rem; color:#332881; font-weight: bold;">
                                                ${kriyaId}
                                            </p>
                                            <p>
                                                Follow our website for the latest updates on exciting workshops
                                                and events
                                            </p>
                                            <b>Best Wishes,</b>
                                            <p style="padding-bottom: 4rem;">
                                                Kriya 2024 Team<br />
                                                PSG College of Technology
                                            </p>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="" target="_blank">

                                                <img src="https://i.ibb.co/HBc2VWT/footer.png" width="666"
                                                    height="130" border="0" alt="Kriya 2024 Registration Cover"
                                                    style="display: block; color: #666666;  font-family: Helvetica, arial, sans-serif; font-size: 16px;"
                                                    class="img-max">



                                            </a>


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
                            <span class="appleFooter" style="color:#666666;">Students Union - PSG College of
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
