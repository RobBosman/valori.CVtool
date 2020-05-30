// HACK: the Redux package assumes `process` exists - mock it here before the module is loaded.
window.process = {env: {NODE_ENV: 'production'}};