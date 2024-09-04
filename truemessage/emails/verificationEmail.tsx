import {
    Html,
    Head,
    Font,
    Preview, 
    Heading,
    Row,
    Section,
    Text,
    Button,

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
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Section>
          <Row>
            <Heading as="h2" className='font-bold text-2xl text-purple-700/50'>Hello {username},</Heading>
          </Row>
          <Row>
            <Text >
              <span className='text-purple-700/50 font-semibold'>Thank you for registering</span>. Please use the following verification
              code to complete your registration:
            </Text>
          </Row>
          <Row>
            <Text className='text-2xl font-bold border-purple-600 rounded-2xl p-3'>{otp}</Text> 
          </Row>
          <Row>
            <Text>
              If you did not request this code, please ignore this email.
            </Text>
          </Row>
          {/* <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Verify here
            </Button>
          </Row> */}
        </Section>
      </Html>
    );
  }