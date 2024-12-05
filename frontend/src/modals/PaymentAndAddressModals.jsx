import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Input = styled.input`
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: ${props => props.secondary ? '#6c757d' : '#4CAF50'};
    color: white;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: ${props => props.secondary ? '#5a6268' : '#388E3C'};
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const ModalTitle = styled.h2`
    margin: 0 0 1.5rem 0;
    color: #333;
`;

export const Modal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    width: 90%;
    max-width: 500px;
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
`;

export const AddressModal = ({
                                 show,
                                 onClose,
                                 onSubmit,
                                 addressData,
                                 setAddressData,
                                 loading,
                                 selectedAddress
                             }) => {
    if (!show) return null;

    return (
        <>
            <ModalOverlay onClick={onClose} />
            <Modal>
                <ModalTitle>
                    {selectedAddress ? `Edit Address - ${selectedAddress.addressName}` : 'Add New Address'}
                </ModalTitle>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label>Address Name</Label>
                        <Input
                            type="text"
                            placeholder="Home, Work, etc."
                            value={addressData.addressName}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                addressName: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Country</Label>
                        <Input
                            type="text"
                            placeholder="Enter your country"
                            value={addressData.country}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                country: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>City</Label>
                        <Input
                            type="text"
                            placeholder="Enter your city"
                            value={addressData.city}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                city: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>District</Label>
                        <Input
                            type="text"
                            placeholder="Enter your district"
                            value={addressData.district}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                district: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Address Line</Label>
                        <Input
                            type="text"
                            placeholder="Enter your address"
                            value={addressData.addressLine}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                addressLine: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Postal Code</Label>
                        <Input
                            type="text"
                            placeholder="Enter postal code"
                            value={addressData.postalCode}
                            onChange={(e) => setAddressData({
                                ...addressData,
                                postalCode: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <ButtonGroup>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (selectedAddress ? 'Update Address' : 'Add Address')}
                        </Button>
                        <Button type="button" secondary onClick={onClose}>
                            Cancel
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>
        </>
    );
};

export const CreditCardModal = ({
                                    show,
                                    onClose,
                                    onSubmit,
                                    creditCardData,
                                    setCreditCardData,
                                    loading,
                                    selectedCreditCard
                                }) => {
    if (!show) return null;

    return (
        <>
            <ModalOverlay onClick={onClose} />
            <Modal>
                <ModalTitle>
                    {selectedCreditCard ? `Edit Credit Card - ${selectedCreditCard.cardHolderName}` : 'Add New Credit Card'}
                </ModalTitle>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label>Card Name</Label>
                        <Input
                            type="text"
                            placeholder="Personal Card, Work Card, etc."
                            value={creditCardData.cardName}
                            onChange={(e) => setCreditCardData({
                                ...creditCardData,
                                cardName: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Card Number</Label>
                        <Input
                            type="text"
                            maxLength="16"
                            value={creditCardData.cardNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 16) {
                                    setCreditCardData({
                                        ...creditCardData,
                                        cardNumber: value
                                    });
                                }
                            }}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Card Holder Name</Label>
                        <Input
                            type="text"
                            value={creditCardData.cardHolderName}
                            onChange={(e) => setCreditCardData({
                                ...creditCardData,
                                cardHolderName: e.target.value
                            })}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Expiration Date</Label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Input
                                type="number"
                                placeholder="MM"
                                min="1"
                                max="12"
                                value={creditCardData.expirationMonth}
                                onChange={(e) => setCreditCardData({
                                    ...creditCardData,
                                    expirationMonth: e.target.value
                                })}
                                required
                                style={{ width: '70px' }}
                            />
                            <Input
                                type="number"
                                placeholder="YYYY"
                                min={new Date().getFullYear()}
                                max={new Date().getFullYear() + 10}
                                value={creditCardData.expirationYear}
                                onChange={(e) => setCreditCardData({
                                    ...creditCardData,
                                    expirationYear: e.target.value
                                })}
                                required
                                style={{ width: '100px' }}
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>CVV</Label>
                        <Input
                            type="password"
                            maxLength="3"
                            value={creditCardData.cvv}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 3) {
                                    setCreditCardData({
                                        ...creditCardData,
                                        cvv: value
                                    });
                                }
                            }}
                            required
                            style={{ width: '70px' }}
                        />
                    </FormGroup>
                    <ButtonGroup>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (selectedCreditCard ? 'Update Card' : 'Add Card')}
                        </Button>
                        <Button type="button" secondary onClick={onClose}>
                            Cancel
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>
        </>
    );
};