# Contributing to JKN USSD Simulator

Thank you for your interest in contributing! 🎉

## ⚠️ Important Notice

This is a **prototype simulation** for educational and development purposes.
It is **NOT** an official BPJS Kesehatan application.

## How to Contribute

### 1. Report Bugs

Found a bug? Please open an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment (OS, Node version, etc.)

### 2. Suggest Features

Have an idea? Open an issue with:
- Feature description
- Use case / problem it solves
- Mockup or example (if applicable)

### 3. Submit Code

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## Code Guidelines

### Backend (Node.js)

- Use ES6+ syntax
- Follow existing code style
- Add comments for complex logic
- Update API docs if adding endpoints
- Test with curl/Postman before PR

### Frontend (React Native)

- Use functional components
- Follow React hooks best practices
- Keep components small and reusable
- Test on both Android and iOS (if possible)

### Database (Prisma)

- Document schema changes
- Provide migration scripts
- Update seed data if needed

## Commit Message Format

```
type(scope): subject

body (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(ussd): add new menu for vaccination schedule
fix(mobile): fix dialpad backspace not working
docs(readme): update installation steps
```

## Testing

Before submitting PR:

### Backend Tests
```bash
cd backend

# Test main endpoints
npm test

# Manual test
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","text":""}'
```

### Mobile Tests
```bash
cd mobile

# Run on device
npm start

# Test all menu flows (1-10)
# Test error handling
# Test network errors
```

## Areas for Contribution

### High Priority
- [ ] Unit tests for USSD engine
- [ ] Integration tests for API
- [ ] Error handling improvements
- [ ] Input validation
- [ ] Accessibility features

### Medium Priority
- [ ] Performance optimization
- [ ] Caching layer
- [ ] Logging improvements
- [ ] UI/UX enhancements
- [ ] Multi-language support

### Advanced
- [ ] JKN API integration (mock)
- [ ] USSD Gateway simulation
- [ ] SMS notification module
- [ ] Queue management system
- [ ] Admin dashboard

## Documentation

When adding features:
- Update README.md
- Update API_EXAMPLES.md for new endpoints
- Add JSDoc comments
- Update Swagger documentation

## Code of Conduct

### Be Respectful
- Respect different opinions
- Accept constructive criticism
- Focus on what's best for the project

### Be Collaborative
- Help others learn
- Share knowledge
- Review PRs constructively

### Be Professional
- No harassment or discrimination
- Keep discussions on-topic
- Follow project guidelines

## Questions?

- Open an issue for technical questions
- Check existing issues first
- Read documentation thoroughly

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping improve JKN USSD Simulator! 🙏**
