<div className="space-y-6">
    <TextField
        label="Email address"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={e => onChange('email', e.target.value)}
        autoComplete="email"
        onKeyDown={e => e.key === 'Enter' && onSubmit(e)}
    />

    <PasswordField
        label="Password"
        placeholder="Enter your password"
        value={form.password}
        onChange={e => onChange('password', e.target.value)}
        autoComplete="current-password"
        onKeyDown={e => e.key === 'Enter' && onSubmit(e)}
    />

    <Button
        onClick={onSubmit}
        loading={busy}
        className="w-full text-base"
    >
        Sign in to your account
    </Button>
</div>