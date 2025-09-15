import { useState, useEffect, useCallback } from 'react';

// Form validation rules and utilities
export const validators = {
    required: value => ({
        isValid: value !== undefined && value !== null && value !== '',
        message: 'This field is required'
    }),

    email: value => ({
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    }),

    password: value => ({
        isValid: value && value.length >= 6,
        message: 'Password must be at least 6 characters long'
    }),

    phone: value => ({
        isValid: /^\+?[\d\s-]{10,}$/.test(value),
        message: 'Please enter a valid phone number'
    }),

    name: value => ({
        isValid: value && value.length >= 2,
        message: 'Name must be at least 2 characters long'
    }),

    date: value => ({
        isValid: value && new Date(value) > new Date(),
        message: 'Please select a future date'
    }),

    time: value => ({
        isValid: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value),
        message: 'Please enter a valid time in 24-hour format (HH:MM)'
    }),
};

// Custom hook for form validation
export const useFormValidation = (initialState, validationRules) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const validateField = (name, value) => {
        if (!validationRules[name]) return true;

        const rules = validationRules[name];
        for (const rule of rules) {
            const validation = validators[rule](value);
            if (!validation.isValid) {
                return validation.message;
            }
        }
        return '';
    };

    const validateForm = useCallback(() => {
        const newErrors = {};
        let formIsValid = true;

        Object.keys(values).forEach(field => {
            const error = validateField(field, values[field]);
            if (error) {
                newErrors[field] = error;
                formIsValid = false;
            }
        });

        setErrors(newErrors);
        setIsValid(formIsValid);
        return formIsValid;
    }, [values, validationRules]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setValues(initialState);
        setErrors({});
        setIsValid(false);
    };

    useEffect(() => {
        validateForm();
    }, [values, validateForm]);

    return {
        values,
        errors,
        isValid,
        handleChange,
        resetForm,
        validateForm
    };
};

export const createValidationRules = (fields) => {
    const rules = {};
    fields.forEach(field => {
        const fieldName = typeof field === 'string' ? field : field.name;
        const validationType = typeof field === 'string' ? field : field.type || fieldName;

        if (validators[validationType]) {
            rules[fieldName] = [validationType];
        }

        // Add required validation if specified
        if (typeof field === 'object' && field.required) {
            rules[fieldName] = ['required', ...(rules[fieldName] || [])];
        }
    });
    return rules;
};