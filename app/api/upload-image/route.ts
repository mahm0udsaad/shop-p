import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToStorage } from '@/app/[lng]/dashboard/products/actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadImageToStorage(formData);
    
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in upload-image API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 