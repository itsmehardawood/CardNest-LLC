import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get('id');

    if (!merchantId) {
      return NextResponse.json(
        { status: false, message: 'Merchant ID is required' },
        { status: 400 }
      );
    }

    const apiUrl = `http://52.55.249.9:8001/api/merchant/getCardScans?id=${merchantId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error:', response.status, errorText);
      return NextResponse.json(
        { status: false, message: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { status: false, message: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}