const Appointment = require('../models/appoinment-model');
const Slot = require('../models/slot-model');
const { bookAppointment } = require('../controllers/appoinment-controller'); 

jest.mock('../models/appoinment-model');
jest.mock('../models/slot-model');

describe('bookAppointment', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { time: '2025-01-20T10:00:00Z', professorId: 'prof123' },
            user: { id: 'student456' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    it('should book an appointment successfully', async () => {
        const mockSlot = { 
            time: '2025-01-20T10:00:00Z', 
            professor: 'prof123', 
            isBooked: false, 
            save: jest.fn(),
        };

        const mockAppointment = {
            save: jest.fn(),
        };

        Slot.findOne.mockResolvedValue(mockSlot);
        Appointment.mockImplementation(() => mockAppointment);

        await bookAppointment(req, res);

        expect(Slot.findOne).toHaveBeenCalledWith({ time: '2025-01-20T10:00:00Z', professor: 'prof123', isBooked: false });
        expect(Appointment).toHaveBeenCalledWith({ student: 'student456', professor: 'prof123', time: '2025-01-20T10:00:00Z' });
        expect(mockAppointment.save).toHaveBeenCalled();
        expect(mockSlot.isBooked).toBe(true);
        expect(mockSlot.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith('Appointment booked');
    });

    it('should return 400 if the slot is unavailable', async () => {
        Slot.findOne.mockResolvedValue(null);

        await bookAppointment(req, res);

        expect(Slot.findOne).toHaveBeenCalledWith({ time: '2025-01-20T10:00:00Z', professor: 'prof123', isBooked: false });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Slot unavailable');
    });

    it('should handle errors and return 500', async () => {
        const mockError = new Error('Database error');
        Slot.findOne.mockRejectedValue(mockError);

        await bookAppointment(req, res);

        expect(Slot.findOne).toHaveBeenCalledWith({ time: '2025-01-20T10:00:00Z', professor: 'prof123', isBooked: false });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error booking appointment');
    });
});
