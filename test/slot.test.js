const { register, login } = require('../controllers/auth-controller');
const { addSlots } = require('../controllers/slot-controller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const Slot = require('../models/slot-model');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user-model');
jest.mock('../models/slot-model');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a user successfully', async () => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                isProfessor: false,
            };

            bcrypt.hash.mockResolvedValue('hashedPassword123');
            const mockUser = {
                save: jest.fn().mockResolvedValue(),
            };
            User.mockImplementation(() => mockUser);

            await register(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword123',
                isProfessor: false,
            });
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('User registered successfully');
        });

        it('should return 500 if an error occurs', async () => {
            req.body = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                isProfessor: false,
            };

            bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error registering user');
        });
    });

    describe('login', () => {
        it('should log in a user successfully', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockUser = {
                _id: 'userId123',
                isProfessor: false,
                password: 'hashedPassword123',
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('fakeToken123');

            await login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId123', isProfessor: false }, process.env.JWT_SECRET);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken123' });
        });

        it('should return 404 if user is not found', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            User.findOne.mockResolvedValue(null);

            await login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        });

        it('should return 401 if password is incorrect', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'wrongPassword',
            };

            const mockUser = {
                password: 'hashedPassword123',
            };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword123');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        });

        it('should return 500 if an error occurs', async () => {
            req.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            User.findOne.mockRejectedValue(new Error('Database error'));

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Invalid credentials');
        });
    });
});

describe('Slot Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: { id: 'professorId123' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('addSlots', () => {
        it('should add a slot successfully', async () => {
            req.body = { time: '10:00 AM' };

            const mockSlot = {
                save: jest.fn().mockResolvedValue(),
            };
            Slot.mockImplementation(() => mockSlot);

            await addSlots(req, res);

            expect(Slot).toHaveBeenCalledWith({ professor: 'professorId123', time: '10:00 AM' });
            expect(mockSlot.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith('Slot added');
        });

        it('should return 500 if an error occurs', async () => {
            req.body = { time: '10:00 AM' };

            Slot.mockImplementation(() => {
                return {
                    save: jest.fn().mockRejectedValue(new Error('Database error')),
                };
            });

            await addSlots(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Error adding slot');
        });
    });
});