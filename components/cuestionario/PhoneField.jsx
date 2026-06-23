'use client';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function PhoneField({ value, onChange, hasError }) {
  return (
    <div className={`pcs-phone ${hasError ? 'pcs-phone-error' : ''}`}>
      <PhoneInput
        international
        defaultCountry="PA"
        value={value}
        onChange={onChange}
        countrySelectProps={{ 'aria-label': 'Country code' }}
      />
    </div>
  );
}
