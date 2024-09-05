import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Section style={{ padding: '20px', backgroundColor: '#fffafa' }}>
        <Row>
          <Heading as="h1" style={styles.heading2}>
            WelCome True Messages
          </Heading>
        </Row>
        <Row>
          <Heading as="h2" style={styles.heading}>
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={styles.paragraph}>
            <span style={styles.highlightText}>Thank you for registering</span>. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={styles.otp}>{otp}</Text>
        </Row>
        <Row>
          <Text style={styles.paragraph}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

// Explicit types for the `styles` object
const styles: { [key: string]: React.CSSProperties } = {
  heading: {
    fontWeight: 'bold',
    fontSize: '24px',
    color: '#9333EA', // Light purple shade
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#333', // Standard black text
    marginBottom: '15px',
  },
  highlightText: {
    color: '#9333EA', // Purple color for emphasis
    fontWeight: '600',
  },
  otp: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#9333EA',
    padding: '10px',
    border: '2px solid #9333EA',
    borderRadius: '8px',
    textAlign: 'center' as const, // Explicit type for `textAlign`
    display: 'inline-block',
    marginBottom: '20px',
  },
  heading2: {
    fontSize: "34px",
    fontWeight: 'bolder',
    color: '#9333EA', // Light purple shade
    marginBottom: '20px',
  }
};
