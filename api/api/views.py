from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
from .models import *
from .serializers import *
import datetime, json, jwt

def create_token(user):
    payload = {
        'id': str(user.id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        'iat': datetime.datetime.utcnow()
    }

    token = jwt.encode(payload, 'secret', algorithm='HS256')
    return token

def custom_response(message, status_code, data=None):
    response = {
        'success': False if status_code > 399 else True,
        'message': message,
        'code': status_code
    }

    if data:
        response['data'] = data

    return Response(response, status=status_code)


class RegisterUser(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = create_token(user)

            response = Response(serializer.data, status=status.HTTP_201_CREATED)
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {
                'jwt': token
            }

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUser(APIView):
    def post(self, request):
        
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email).first()

        # if user is None:
        #     raise AuthenticationFailed('User not found!')

        # if not user.check_password(password):
        #     raise AuthenticationFailed('Incorrect password!')

        if user is None or not user.check_password(password):
            raise AuthenticationFailed('Incorrect email or password!')

        # payload = {
        #     'id': str(user.id),
        #     'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        #     'iat': datetime.datetime.utcnow()
        # }

        # token = jwt.encode(payload, 'secret', algorithm='HS256')

        token = create_token(user)

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }

        # response = custom_response('Login successful!', status.HTTP_200_OK)
        # response.set_cookie(key='jwt', value=token, httponly=True)
        # response.data = {
        #     'jwt': token
        # }

        return response

class LogoutUser(APIView):
    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('jwt')
        # response.data = {
        #     'message': 'Logout successful!'
        # }

        return response

class BaseAuthenticatedView(APIView):
    def authenticate(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!')

        return user

class UserView(BaseAuthenticatedView, APIView):
    def get(self, request, pk=None):
        authenticated_user = self.authenticate(request)
        if authenticated_user.is_superuser:
            if pk:
                try:
                    queryset = User.objects.get(pk = pk)
                except User.DoesNotExist:
                    return Response({'error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
                serializer = UserSerializer(queryset)
            else:
                queryset = User.objects.all()
                serializer = UserSerializer(queryset, many=True)
        else:
            serializer = UserSerializer(authenticated_user)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if authenticated_user.is_superuser:
            if pk:
                try:
                    queryset = User.objects.get(pk=pk)
                except User.DoesNotExist:
                    return Response({'error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
                serializer = UserSerializer(queryset, data=request.data, partial=True)
            else:
                return Response({'error': 'User ID not provided!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = UserSerializer(authenticated_user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        try:
            queryset = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)

        queryset.delete()
        return Response({'message': 'User deleted!'}, status=status.HTTP_204_NO_CONTENT)

class CategoryView(BaseAuthenticatedView, APIView):
    def get(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if pk:
            try:
                queryset = Category.objects.get(pk = pk)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found!'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(queryset)
        else:   
            queryset = Category.objects.all()
            serializer = CategorySerializer(queryset, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        authenticated_user = self.authenticate(request)
        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        if pk:
            try:
                queryset = Category.objects.get(pk=pk)
            except Category.DoesNotExist:
                return Response({'error': 'Category not found!'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(queryset, data=request.data, partial=True)
        else:
            return Response({'error': 'Category ID not provided!'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        try:
            queryset = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found!'}, status=status.HTTP_404_NOT_FOUND)

        queryset.delete()
        return Response({'message': 'Category deleted!'}, status=status.HTTP_204_NO_CONTENT)

class LocationView(BaseAuthenticatedView, APIView):
    def get(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if pk:
            try:
                queryset = Location.objects.get(pk = pk)
            except Location.DoesNotExist:
                return Response({'error': 'Location not found!'}, status=status.HTTP_404_NOT_FOUND)
            serializer = LocationSerializer(queryset)
        else:
            queryset = Location.objects.all()
            serializer = LocationSerializer(queryset, many=True)
        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        serializer = LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        if pk:
            try:
                queryset = Location.objects.get(pk=pk)
            except Location.DoesNotExist:
                return Response({'error': 'Location not found!'}, status=status.HTTP_404_NOT_FOUND)
            serializer = LocationSerializer(queryset, data=request.data, partial=True)
        else:
            return Response({'error': 'Location ID not provided!'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        try:
            queryset = Location.objects.get(pk=pk)
        except Location.DoesNotExist:
            return Response({'error': 'Location not found!'}, status=status.HTTP_404_NOT_FOUND)

        queryset.delete()
        return Response({'message': 'Location deleted!'}, status=status.HTTP_204_NO_CONTENT)

class EventView(BaseAuthenticatedView, APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                queryset = Event.objects.get(pk = pk)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found!'}, status=status.HTTP_404_NOT_FOUND)
            serializer = EventSerializer(queryset)

            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        else:
            queryset = Event.objects.all()

            q = request.query_params.get('q', None)
            category = request.query_params.get('category', None)
            location = request.query_params.get('location', None)

            if q is not None:
                queryset = queryset.filter(title__icontains=q)
            if category is not None and category != "":
                queryset = queryset.filter(categories__name__icontains=category)
            if location is not None:
                queryset = queryset.filter(location__name__icontains=location)

            paginator = CustomPageNumberPagination()
            paginator.page_size = 3
            result_page = paginator.paginate_queryset(queryset, request)
            serializer = EventSerializer(result_page, many=True)

            return paginator.getPaginatedResponse(serializer.data)

    def post(self, request):
        authenticated_user = self.authenticate(request)

        if authenticated_user.is_superuser:
            serializer = EventSerializer(data=request.data)
        else:
            request.data['users'] = [authenticated_user.id]
            serializer = EventSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        # if not authenticated_user.is_superuser:
        #     raise AuthenticationFailed('Action denied!')

        if pk:
            try:
                queryset = Event.objects.get(pk=pk)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found!'}, status=status.HTTP_404_NOT_FOUND)

            if authenticated_user.is_superuser:
                serializer = EventSerializer(queryset, data=request.data, partial=True)
            else:
                isAdding = request.data.get('isAdding', False)

                if isAdding:
                    queryset.users.add(authenticated_user)
                else:
                    queryset.users.remove(authenticated_user)
                    
                serializer = EventSerializer(queryset, data=request.data, partial=True)
        else:
            return Response({'error': 'Event ID not provided!'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        authenticated_user = self.authenticate(request)

        if not authenticated_user.is_superuser:
            raise AuthenticationFailed('Action denied!')

        try:
            queryset = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found!'}, status=status.HTTP_404_NOT_FOUND)

        queryset.delete()
        return Response({'message': 'Event deleted!'}, status=status.HTTP_204_NO_CONTENT)

class CustomPageNumberPagination(PageNumberPagination):
    def getPaginatedResponse(self, data):
        total_pages = (self.page.paginator.count + self.page_size - 1) // self.page_size
        return Response({
            # 'next': self.get_next_link(),
            # 'previous': self.get_previous_link(),
            'total_pages': total_pages,
            'results': data
        }, status=status.HTTP_200_OK)
