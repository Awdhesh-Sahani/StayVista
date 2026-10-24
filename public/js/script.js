(() => {
    'use strict'

    const userAvatar = document.querySelector('[data-user-avatar]')
    const avatarColors = ['#2563eb', '#7c3aed', '#c026d3', '#db2777', '#e11d48',
        '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#0891b2'
    ]

    if (userAvatar) {
        const colorKey = `stayvista-avatar-${userAvatar.dataset.userAvatar}`
        let avatarColor
        try {
            avatarColor = localStorage.getItem(colorKey)
        } catch (error) {
            avatarColor = null
        }
        if (!avatarColor) {
            avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]
            try {
                localStorage.setItem(colorKey, avatarColor)
            } catch (error) {
                // Keep the color for this page even when browser storage is blocked.
            }
        }
        userAvatar.style.setProperty('background-color', avatarColor, 'important')
        userAvatar.style.setProperty('color', '#fff', 'important')
    }

    const themeToggle = document.querySelector('[data-theme-toggle]')
    let savedTheme
    try {
        savedTheme = localStorage.getItem('stayvista-theme')
    } catch (error) {
        savedTheme = null
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    function applyTheme(theme) {
        const isDark = theme === 'dark'
        document.body.classList.toggle('dark-mode', isDark)
        if (themeToggle) {
            const icon = themeToggle.querySelector('i')
            icon.classList.toggle('fa-moon', !isDark)
            icon.classList.toggle('fa-sun', isDark)
            const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
            themeToggle.setAttribute('aria-label', label)
            themeToggle.setAttribute('title', label)
        }
    }

    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'))

    // Register the toggle only when the signed-in navbar is present.
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'
            try {
                localStorage.setItem('stayvista-theme', nextTheme)
            } catch (error) {
                // Apply the selected theme for this page even when browser storage is blocked.
            }
            applyTheme(nextTheme)
        })
    }

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()