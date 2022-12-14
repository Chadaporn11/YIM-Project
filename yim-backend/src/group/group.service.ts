/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupFilter } from './dto/group-filter.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: Repository<Group>,
    private userService: UsersService,
  ) {}
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    try {
      const { name, userId } = createGroupDto;
      const findUser = await this.userService.findOne(userId);
      const DataInsert = this.groupRepo.create({
        name: name,
        user: findUser,
    });
      return await this.groupRepo.save(DataInsert);
    } catch (error) {
        throw new HttpException('Cannot Create Groups',HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Group[]> {
    return this.groupRepo.find();
  }

  async getGroupByFilter(id: number,filterDtp: GroupFilter): Promise<Group[]>{
    const { search } = filterDtp;
    let groups = await this.findGroupByUserId(id);
    if (search)
      groups = groups.filter(groups => groups.name.includes(search));
    return groups;
  }

  //search group by UserID
  async findGroupByUserId(id: number):Promise<Group[]> {
    return await this.groupRepo
    .createQueryBuilder('group')
    .leftJoinAndSelect('group.user', 'user')
    .leftJoinAndSelect('group.tasks','task')
    .where('group.userId = :userId', { userId: id })
    .getMany();
    
  }

  //serach group by GroupId for update group.
  findGroup(id: number): Promise<Group> {
    return this.groupRepo.findOneByOrFail({ id });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
   try {
    const groupData = await this.findGroup(id);
    const { name } = updateGroupDto;
    if (name) groupData.name = name;
    return await this.groupRepo.save(groupData);
   } catch (error) {
    throw new HttpException('Cannot Update this Group.',HttpStatus.BAD_REQUEST);
   }
  }

  async remove(id: number) {
    try {
      const findGroup = await this.findGroup(id);
      return await this.groupRepo.delete({ id });
    } catch (error) {
      throw new HttpException('Cannot Remove this Group.',HttpStatus.BAD_REQUEST);
    }
  }
}