import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styles from '../css/Registration.module.css';
import rounded_img from '../images/aa.png';

const siteKey = '6LcZhjYqAAAAAGYKhqjBFDqYtbQXWP7Gh3ddI1cr';

function Registration() {
  const [form, setForm] = useState(true);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(''); // State to store the email
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

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
    recaptchaRef.current?.execute(); // reCAPTCHA and generates a token
  };

  // Handle form submission after reCAPTCHA verification
  const handleFormSubmit = async (token: string) => {
    const emailInput = (document.getElementById("college-email") as HTMLInputElement).value;
    setEmail(emailInput); // Update email state
    console.log('Submitting form with token:', token); 

    try {
      const response = await fetch('http://13.126.250.226:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email: emailInput }), // Send token and email to the backend
      });

      const result = await response.json();
      console.log(result.success)
      if (result.message === "OTP sent successfully") {
        setForm(false); 
      } else {
        alert('Error sending OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value.length === 1 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus(); 
    } else if (value.length === 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus(); 
    }
  };

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
                  <input type="text" id="name" placeholder="Your Name" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="branch">Branch</label>
                  <select id="branch" required>
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
                  <select id="domain" required>
                    <option value="MACHINE LEARNING">MACHINE LEARNING</option>
                    <option value="WEB DEVELOPMENT">WEB DEVELOPMENT</option>
                    <option value="DESIGNER">DESIGNER</option>   
                  </select>
                </div>
                <div className={`${styles.form_group_inline}`}>
                  <div className={`${styles.form_group}`}>
                    <label htmlFor="gender">Gender</label>
                    <select id="gender" required>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHERS">OTHERS</option>
                    </select>
                  </div>
                  <div className={`${styles.form_group}`}>
                    <label htmlFor="scholar_type">Scholar Type</label>
                    <select id="scholar_type" required>
                      <option value="DAY SCHOLAR">DAY SCHOLAR</option>
                      <option value="HOSTELLER">HOSTELLER</option>
                    </select>
                  </div>
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="student-number">Student Number</label>
                  <input type="text" id="student_no" placeholder="Student Number" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="college-email">College Email ID</label>
                  <input type="email" id="college-email" placeholder="College Email" required />
                </div>
                <div className={`${styles.form_group}`}>
                  <label htmlFor="mobile-number">Mobile No.</label>
                  <input type="text" id="phone_number" placeholder="Mobile No." required />
                </div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  size="invisible"
                  onChange={handleRecaptcha} // reCAPTCHA triggers this on success
                />
                <button className={`${styles.btn_submit}`} type="submit">Verify</button>
              </form>
            </div>
          ) : (
            <div className={`${styles.registration_form}`}>
              <form>
                <h1 className={`${styles.otp_heading}`}>Verification Code</h1>
                <p className={`${styles.para_otpsent}`}>
                 We have sent a verification code to your college ID {email}{' '}
                 <button className={`${styles.btn_edit_email}`} disabled>✏️</button>
                 </p>
                <div className={`${styles.otp_input_group}`}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      onChange={(e) => handleOtpChange(e, index)}
                      ref={(el) => otpRefs.current[index] = el}
                      className={styles.otp_input}
                    />
                  ))}
                </div>
                <button className={`${styles.btn_submit}`} type="submit">Submit</button>
                <div className={`${styles.resend_otp}`}>
                  <p>Resend OTP</p>
                </div>
              </form>
            </div>
          )}

          <div className={`${styles.inquiry}`}>
            <p>For Inquiry +91-9811021619 +91-9800000000</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registration;
