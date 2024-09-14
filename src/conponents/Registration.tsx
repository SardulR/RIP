import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from '../css/Registration.module.css';
import rounded_img from '../images/aa.png';
import Timer from './Timer';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const siteKey = '6LcZhjYqAAAAAGYKhqjBFDqYtbQXWP7Gh3ddI1cr';

function Registration() {
  const [form, setForm] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [otpcaptchaToken, setotpCaptchaToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(''); // State to store the email
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaRefotp = useRef<ReCAPTCHA | null>(null);
  const recaptchaRefotpResend = useRef<ReCAPTCHA | null>(null);

  const [resendChange, setResendChange] = useState(true);

  //form data 

  const [name, setName] = useState<string>("");
  const [studentNo, setStudentNo] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [scholarType, setScholarType] = useState<string>("");
  const [domain, setDomain] = useState<string>("");

  // end form data 



  // Refs for OTP input fields
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle reCAPTCHA token
  const handleRecaptcha = (token: string | null) => {
    console.log('reCAPTCHA token:', token);
    setCaptchaToken(token);
    // Proceed to handle form submission only if token is not null
    if (token) {
      handleFormSubmit(token);
    } else {
      alert('reCAPTCHA verification failed, please try again.');
    }
  };

  // Manually trigger reCAPTCHA on form submit
  const triggerRecaptcha = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Triggering reCAPTCHA...');
    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    } // reCAPTCHA and generates a token
  };

  // Handle form submission after reCAPTCHA verification
  const handleFormSubmit = async (token: string) => {
    const emailInput = (document.getElementById("college_email") as HTMLInputElement).value;
    setEmail(emailInput); // Update email state
    console.log('Submitting form with token:', token);

    try {
      const response = await fetch('http://13.126.250.226:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, token }), // Send token and email to the backend
      });

      const result = await response.json();
      console.log(result.success)
      toast.success(result.message, {
        //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Time in ms (3 seconds)
        });
      if (result.message === "OTP sent successfully") {
        setForm(false);
      } else {
        toast.error('Error sending OTP. Please try again.', {
            // position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000, // Time in ms (3 seconds)
          });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred. Please try again.', {
        //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Time in ms (3 seconds)
        });
    
    }
    setForm(false);
  };
  // end of calling register

  const handleRecaptchaotpResend = (token_resend: string | null) => {
    console.log('reCAPTCHA token:', token_resend);
    setotpCaptchaToken(token_resend);
   
    if (token_resend) {
      handleOtpResend(email, token_resend);
    } else {
      alert('reCAPTCHA verification failed, please try again.');
    }
  };

 
  const triggerRecaptchaotpResend = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Triggering reCAPTCHA...');
    recaptchaRefotpResend.current?.execute(); 
  };


  const handleOtpResend = async (email: string, token_resend: string) => {
    console.log('Submitting form with email:', token_resend);

    try {
      const response = await fetch('http://13.126.250.226:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, token: token_resend }), // Adjust as necessary
      });

      const result = await response.json();
      console.log(result.success);
      toast.success(result.message,{
        autoClose:3000,
      });
      if (result.message === "OTP sent successfully") {
        setForm(false);
        setResendChange(true);
      } else {
        toast.error('Error sending OTP. Please try again.',{
          autoClose:3000
        });
        
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred. Please try again.', {
        autoClose:3000,
      });
    }
  };




  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value; 
      setOtp(newOtp);

      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Handle reCAPTCHA token
  const handleRecaptchaotp = (token_email: string | null) => {
    console.log('reCAPTCHA token:', token_email);
    setotpCaptchaToken(token_email);
  
    if (token_email) {
      handleOtpSubmit(token_email);
    } else {
      alert('reCAPTCHA verification failed, please try again.');
    }
  };

  
  const triggerRecaptchaotp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Triggering reCAPTCHA...');
    recaptchaRefotp.current?.execute(); 
  };
 

  const handleOtpSubmit = async (token_email: string) => {
    const otpValue = otp.join("");
    const studentDetails = {
      name,
      studentNo,
      phoneNumber,
      branch,
      email,
      gender,
      scholarType,
      domain,
    };

    try {
      const requestBody = {
        name: studentDetails.name,
        student_no: studentDetails.studentNo,
        phone_number: studentDetails.phoneNumber,
        branch: studentDetails.branch,
        email: studentDetails.email,
        gender: studentDetails.gender,
        scholar_type: studentDetails.scholarType,
        domain: studentDetails.domain,
        otp: otpValue,
        token: token_email,
      };

      console.log("Request Body: ", requestBody);

      const email_response = await fetch('http://13.126.250.226:8000/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await email_response.json();
      console.log("Response: ", result);

      if (email_response.ok) {
        console.log(result.success);
        console.log(result.message);
        toast.success(result.message, {
          autoClose:3000,
        });
        setForm(true)
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        console.error("Server error:", result.message);
        toast.error(result.message || "Error in request.",{
          autoClose:3000,
        });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast.error('An error occurred. Please try again.', {
        autoClose:3000,
      });
    }
  }




  // Handle OTP input change
  // const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

  //   const { value } = e.target;
  //   if (value.length === 1 && otpRefs.current[index + 1]) {
  //     otpRefs.current[index + 1]?.focus();
  //   } else if (value.length === 0 && otpRefs.current[index - 1]) {
  //     otpRefs.current[index - 1]?.focus();
  //   }
  // };




  return (
    <section className={`${styles.reg}`}>
      <div className={`${styles.container}`}>
        <div className={`${styles.top}`}>
          <h1>Registration Form</h1>
        </div>
        <div className={`${styles.bottom}`}>
          <div className={`${styles.img}`}>
            <img src={rounded_img} alt="Decorative" />
          </div>

          {form ? (
            <div className={`${styles.registration_form}`}>
              <form onSubmit={triggerRecaptcha}>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" value={name}
                    onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="branch">Branch</label>
                  <select id="branch" name='branch' value={branch}
                    onChange={(e) => setBranch(e.target.value)} required>
                    <option value="SELECT BRANCH">SELECT BRANCH</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="CS">CS</option>
                    <option value="CSE-DS">CSE-DS</option>
                    <option value="CSE-AIML">CSE-AIML</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="domain">Domain</label>
                  <select id="domain" value={domain}
                    onChange={(e) => setDomain(e.target.value)} required>
                    <option value="SELECT DOMAIN">SELECT DOMAIN</option>
                    <option value="MACHINE LEARNING">MACHINE LEARNING</option>
                    <option value="WEB DEVELOPMENT">WEB DEVELOPMENT</option>
                    <option value="DESIGNER">DESIGNER</option>
                  </select>
                </div>
                <div className={`${styles.form_group_inline}`}>
                  <div className={`${styles.form_group}`}>
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" value={gender}
                      onChange={(e) => setGender(e.target.value)} required>
                      <option value="SELECT GENDER">SELECT GENDER</option>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHERS">OTHERS</option>
                    </select>
                  </div>
                  <div className={`${styles.form_group}`}>
                    <label htmlFor="scholar_type">Scholar Type</label>
                    <select id="scholar_type" value={scholarType}
                      onChange={(e) => setScholarType(e.target.value)} required>
                      <option value="SELECT TYPE">SELECT SCHOLAR TYPE</option>
                      <option value="DAY SCHOLAR">DAY SCHOLAR</option>
                      <option value="HOSTELLER">HOSTELLER</option>
                    </select>
                  </div>
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="student-number">Student Number</label>
                  <input type="text" id="student_no" value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)} placeholder="Student Number" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="college-email">College Email ID</label>
                  <input type="email" id="college_email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="College Email" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="mobile-number">Mobile No.</label>
                  <input type="text" id="phone_number" value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Mobile No." required />
                </div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  size="invisible"
                  onChange={handleRecaptcha} 
                />
                <button className={`${styles.btn_submit}`} type="submit" onClick={() => handleFormSubmit}>Verify</button>
              </form>
            </div>
          ) : (
            <div className={`${styles.registration_form}`}>
              <form onSubmit={triggerRecaptchaotp}>
                <h1 className={`${styles.otp_heading}`}>Verification Code</h1>
                <p className={`${styles.para_otpsent}`}>
                  We have sent a verification code to your college ID {email}{' '}
                  <button className={`${styles.btn_edit_email}`} disabled>✏️</button>
                </p>
                <div className={`${styles.otp_input_group}`}>
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      value={value}
                      maxLength={1}
                      onChange={(e) => handleChange(e, index)}
                      ref={(el) => otpRefs.current[index] = el}
                      className={`${styles.otp_input}`}
                    />
                  ))}
                </div>
                <ReCAPTCHA
                  ref={recaptchaRefotp}
                  sitekey={siteKey}
                  size="invisible"
                  onChange={handleRecaptchaotp} 
                />
                <button className={`${styles.btn_submit}`} type='submit' onClick={() => handleOtpSubmit}>Submit</button>

              </form>

              <form onSubmit={triggerRecaptchaotpResend}>
                <div className={`${styles.resend_otp}`}>
                  <ReCAPTCHA
                    ref={recaptchaRefotpResend}
                    sitekey={siteKey}
                    size="invisible"
                    onChange={handleRecaptchaotpResend} 
                  />

                 


                  {resendChange ?  <>
                    <Timer />
                    <div style={{ opacity: 0 }}>
                    {setTimeout(() => {
                      setResendChange(false)
                    }, 62000)}
                  </div>
                  </>: <button className={`${styles.btn_resend}`} onClick={() => handleOtpResend} type='submit'>
                    Resend OTP
                  </button>}

                </div>
              </form>

            </div>
          )}

          <div className={`${styles.inquiry}`}>
            <p>For Inquiry +91-9654933993 +91-9811021619</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default Registration;
