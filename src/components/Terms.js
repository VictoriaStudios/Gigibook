import useStyles from "./styles"
import { Button, Typography } from "@material-ui/core"

const Terms = ({ closeTerms, openPrivacy }) => {

    const classes = useStyles()
    return (
        <div className={classes.termsPaper}>
            <div className={classes.termsBody}>
                <Typography variant="h5" gutterBottom>
                    Generic Terms of Service Template
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please read these terms of service ("terms", "terms of service") carefully before using the  GigiBook website (the "service") operated by Marcel Bruna ("us", 'we", "our").
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Conditions of Use
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Before you continue using our website we advise you to read our <Button onClick={() => {closeTerms(); openPrivacy()}}>Privacy Policy</Button> regarding our user data collection. It will help you better understand our practices.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Copyright - Website
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.

                </Typography>            <Typography variant="h5" gutterBottom>
                    Communications
                </Typography>
                <Typography variant="body1" gutterBottom>
                    The entire communication with us is electronic. Every time you send us an email or visit our website, you are going to be communicating with us. You hereby consent to receive communications from us. If you subscribe to the news on our website, you are going to receive regular emails from us. We will continue to communicate with you by posting news and notices on our website and by sending you emails. You also agree that all notices, disclosures, agreements and other communications we provide to you electronically meet the legal requirements that such communications be in writing.
                </Typography>            <Typography variant="h5" gutterBottom>
                    Applicable Law
                </Typography>
                <Typography variant="body1" gutterBottom>
                    By visiting this website, you agree that the laws of Republic of Peru, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between Marcel Bruna and you, or its business partners and associates.
                </Typography>            <Typography variant="h5" gutterBottom>
                    Disputes
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court in Peru and you consent to exclusive jurisdiction and venue of such courts.
                </Typography>            <Typography variant="h5" gutterBottom>
                    Comments, Reviews, and Emails
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property rights, invasive of privacy or injurious in any other way to third parties. Content has to be free of software viruses, political campaign, and commercial solicitation.
                    We reserve all rights (but not the obligation) to remove and/or edit such content. User contributions licensed under cc by-sa 3.0 with attribution required.
                </Typography>            <Typography variant="h5" gutterBottom>
                    License and Site Access
                </Typography>
                <Typography variant="body1" gutterBottom>
                    We grant you a limited license to access and make personal use of this website. You are not allowed to download or modify it. This may be done only with written consent from us.
                </Typography>            <Typography variant="h5" gutterBottom>
                    User Account
                </Typography>
                <Typography variant="body1" gutterBottom>
                    If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and password). You are responsible for all activities that occur under your account or password.
                    We reserve all rights to terminate accounts, edit or remove content and cancel orders in their sole discretion.
                </Typography>
            </div>
        </div>

    )
}

export default Terms