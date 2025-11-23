export const isCyrillic = (text) => /[а-яА-ЯЁё]/.test(text)

export const isValidEmail = (email) =>
  /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i.test(email)

export const togglePasswordVisibility = (
  event,
  isPasswordVisible,
  setIsPasswordVisible,
) => {
  const container =
    event.target.parentElement.tagName == 'DIV'
      ? event.target.parentElement
      : event.target.parentElement.parentElement
  const ContInd = Array.from(
    document.querySelectorAll('.password-I'),
  ).findIndex((el) => el === container)
  isPasswordVisible.splice(ContInd, 1, !isPasswordVisible[ContInd])
  setIsPasswordVisible([...isPasswordVisible])
}

export const ShowToolTip = (event, act) => {
  if (act) {
    const ParentOfInput = event.target.parentElement
    ParentOfInput.querySelector('div:last-child').style.display = 'block'
  } else if (!act) {
    const ParentOfInput = event.target.parentElement
    ParentOfInput.querySelector('div:last-child').style.display = 'none'
  }
}

export const handleChange = (event, setName) => {
  const value = event.target.value
  setName(value)

  if (isCyrillic(value)) {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}

export const handleChange2 = (event, setEmail) => {
  const value = event.target.value
  setEmail(value)

  if (!isValidEmail(value) && value !== '') {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}

export const handleChange3 = (event, setLoginName) => {
  const value = event.target.value
  setLoginName(value)
  if (isCyrillic(value)) {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}

export const checkNumberAndLang = (event, setPassword) => {
  const value = event.target.value
  setPassword(value)

  if (value.length < 8 || isCyrillic(value)) {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}
export const checkNumberAndLang2 = (event, setRepPassword) => {
  const value = event.target.value
  setRepPassword(value)

  if (value.length < 8 || isCyrillic(value)) {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}

export const checkNumberAndLang3 = (event, setLoginPassword) => {
  const value = event.target.value
  setLoginPassword(value)

  if (value.length < 8 || isCyrillic(value)) {
    ShowToolTip(event, true)
  } else {
    ShowToolTip(event, false)
  }
}
