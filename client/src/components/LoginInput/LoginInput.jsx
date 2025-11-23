import styles from './LoginInput.module.css'

function LoginInput({ type, placeholder, onChange, value }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      className={styles['input']}
      onChange={onChange}
    />
  )
}

export default LoginInput
