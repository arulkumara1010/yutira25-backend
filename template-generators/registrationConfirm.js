export const registrationConfirmTemplate = (
  name,
  kriyaId,
  headerImg = "https://i.ibb.co/129BwTm/header.png",
  footerImg = "https://i.ibb.co/HBc2VWT/footer.png"
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
                                            <tr>
                                                <td>
                                                    <a href="" target="_blank">
                                                        
                                                        <img 
                                                        src="${headerImg}"
                                                    
                                                            width="666" border="0" alt="Kriya 2023 Cover"
                                                            style="display: block; color: #666666;  font-family: Helvetica, arial, sans-serif; font-size: 16px;"
                                                            class="img-max">



                                                    </a>
                                                        <!-- src="https://i.ibb.co/qknwSd6/Pastel-Rainbow-Modern-January-Monthly-Email-Header-1.png" -->

                                                </td>
                                            </tr>
                                            <tr style="background: white; margin-top: 2rem;">
                                                <td align="center">
                                                    <p
                                                        style="font-size: 1.5rem; font-weight: 600; font-family: Arial, Helvetica, sans-serif; color: #3A3A3A; padding-top: 2rem;">
                                                        Thank you for registering!
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr style="background: white; ">
                                                <td
                                                    style="padding: 0px 40px 0px 2rem; font-size: 1rem; font-family: Arial, Helvetica, sans-serif;">
                                                    <b style="font-size: 1.2rem;" >
                                                        Hey ${name},
                                                    </b>
                                                    <p>
                                                        Thank you for registering for Kriya 2023. We are glad to have you on board. We hope you have a great time at our event. Your Kriya ID is 
                                                    </p>
                                                    <p style="font-size: 2rem; color: teal; font-weight: bold;">
                                                        ${kriyaId}
                                                    </p>
                                                    <p>
                                                        We have received your registration and we will be in touch with you soon.
                                                    </p>
                                                    <b>Best Wishes,</b><br/>
                                                    <p style="padding-bottom: 4rem;">

                                                        Kriya 2024 Team<br/>    
                                                        PSG College of Technology
                                                    </p>
                                                    
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="" target="_blank">
                                                        
                                                        <img 
                                                        src="${footerImg}"
                                                    
                                                            width="666" border="0" alt="Intrams 2k22 Registration Cover"
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
                    <!-- UNSUBSCRIBE COPY -->
                    <table width="666" border="0" cellspacing="0" cellpadding="0" align="center"
                        class="responsive-table">
                        <tbody>
                            <tr>
                                <td align="center"
                                    style="padding: 1rem;    font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">
                                    <span class="appleFooter" style="color:#666666;">Students Union - PSG College of Technology
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
`;
